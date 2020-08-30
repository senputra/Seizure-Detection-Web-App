import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { INITIATE_UPLOAD } from '@core/actions';

@Injectable({ providedIn: 'root' })
export class RecordService {
  private readonly constraingObj: MediaStreamConstraints = {
    audio: true,
    video: {
      facingMode: 'user',
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 },
    },
  };

  private mediaStream: MediaStreamAudioSourceNode | undefined = undefined;
  private audioMeter: ScriptProcessorNode | undefined = undefined;
  private audioContext: AudioContext | undefined = undefined;
  private mediaRecorder: MediaRecorder | undefined = undefined;
  private processor: ScriptProcessorNodeMod | undefined = undefined;
  private videoPreviewHTML: HTMLVideoElement | undefined = undefined;

  constructor(private store: Store) {}

  private createAudioMeter(
    audioContext: AudioContext,
    clipLevel?: number,
    averaging?: number,
    clipLag?: number,
  ): ScriptProcessorNode {
    this.processor = audioContext.createScriptProcessor(512 * 16) as ScriptProcessorNodeMod;
    /**
     * onaudioprocess is triggerred everytime the buffer size is as specified
     */
    this.processor.onaudioprocess = this.volumeAudioProcess as (
      this: ScriptProcessorNode,
      ev: AudioProcessingEvent,
      // tslint:disable-next-line: no-any
    ) => any;
    this.processor.clipping = false;
    this.processor.lastClip = 0;
    this.processor.volume = 0;
    this.processor.clipLevel = clipLevel || 0.98;
    this.processor.averaging = averaging || 0.95;
    this.processor.clipLag = clipLag || 750;

    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    this.processor.connect(audioContext.destination);

    // processor.checkClipping = function (): boolean {
    //   if (!this.clipping) {
    //     return false;
    //   }
    //   if (this.lastClip + this.clipLag < window.performance.now()) {
    //     this.clipping = false;
    //   }
    //   return this.clipping;
    // };

    this.processor.shutdown = function (): void {
      this.disconnect();
      this.onaudioprocess = null;
    };

    this.processor.onLoudListener = () => {
      this.aboveThresholdListener();
    };
    return this.processor;
  }

  private volumeAudioProcess(
    this: ScriptProcessorNodeMod,
    event: AudioProcessingEvent,
    loudnessThreshold?: number,
  ): void {
    const buf = event.inputBuffer.getChannelData(0);
    const bufLength = buf.length;
    let sum = 0;
    let x;

    // Do a root-mean-square on the samples: sum up the squares...
    for (let i = 0; i < bufLength; i++) {
      x = buf[i];
      if (Math.abs(x) >= this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    // ... then take the square root of the sum.
    const rms = Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume * this.averaging);
    // console.log(rms);
    // console.log(this.volume);
    if (this.volume > (loudnessThreshold || 0.1)) {
      this.onLoudListener();
    }
  }

  private aboveThresholdListener(): void {
    // console.log('very loud');
  }

  setVideoPreviewElement(eleName: string): void {
    this.videoPreviewHTML = document.getElementById(eleName) as HTMLVideoElement;
    if (this.videoPreviewHTML === null) {
      alert('Video preview element not found Error');
    }
  }
  startRecording(): void {
    if (typeof this.mediaRecorder !== 'undefined') {
      this.mediaRecorder.start();
      console.log(this.mediaRecorder.state);
    } else {
      throw MEDIA_RECORD_UNDEFINED_ERROR;
    }
  }

  stopRecording(): void {
    if (typeof this.mediaRecorder !== 'undefined') {
      this.mediaRecorder.stop();
      console.log(this.mediaRecorder.state);
    } else {
      throw MEDIA_RECORD_UNDEFINED_ERROR;
    }
  }

  // Start video view stream
  startVideoStream(): void {
    this.audioContext = new AudioContext();
    navigator.mediaDevices.getUserMedia(this.constraingObj).then((mediaStreamObj: MediaStream) => {
      // attach to video to camera feed
      if (typeof this.videoPreviewHTML !== 'undefined') {
        this.videoPreviewHTML.srcObject = mediaStreamObj;
        this.videoPreviewHTML.onloadedmetadata = (e: Event) => {
          if (typeof this.videoPreviewHTML !== 'undefined') {
            this.videoPreviewHTML.muted = true; // mute before preview to avoid echo
            this.videoPreviewHTML.play();
          }
        };
      } else {
        alert('Video preview element not found Error');
        return;
      }

      // attach to preview after recording
      this.mediaRecorder = new MediaRecorder(mediaStreamObj);
      const dataBuffer: BlobPart[] | undefined = [];

      // attach media stream to audioContext as an input for processing
      if (typeof this.audioContext !== 'undefined') {
        this.mediaStream = this.audioContext.createMediaStreamSource(mediaStreamObj);
        this.audioMeter = this.createAudioMeter(this.audioContext) as ScriptProcessorNode;
        this.mediaStream.connect(this.audioMeter);
      } else {
        throw Error('Audio context is undefined');
      }

      this.mediaRecorder.ondataavailable = (ev: BlobEvent) => {
        console.log(ev.data);
        dataBuffer.push(ev.data);
      };
      this.mediaRecorder.onstop = ev => {
        const blob = new Blob(dataBuffer, { type: 'video/mp4;' });
        dataBuffer.splice(0);
        const videoURL = window.URL.createObjectURL(blob);
        this.store.dispatch(
          INITIATE_UPLOAD({
            blobFile: blob,
            filename: 'lmao',
            videoURL,
          }),
        );
      };
    });
  }
  shutdown(): void {
    this.processor?.shutdown();
    this.videoPreviewHTML?.pause();
    this.audioMeter?.disconnect();
    this.audioContext?.close();
  }
}

declare type ScriptProcessorNodeMod = ScriptProcessorNode & {
  clipping: boolean;
  lastClip: number;
  volume: number;
  clipLevel: number;
  averaging: number;
  clipLag: number;

  checkClipping: () => boolean;
  shutdown: () => void;

  onLoudListener: () => void;
};

const MEDIA_RECORD_UNDEFINED_ERROR = Error('MediaRecord is undefined');
