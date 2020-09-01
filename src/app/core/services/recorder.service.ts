import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { INITIATE_UPLOAD } from '@core/actions';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class RecordService {
  constructor(private store: Store, private sanitizer: DomSanitizer) {}
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

  private canva: HTMLCanvasElement | undefined | null = undefined;
  private spinner: HTMLDivElement | undefined = undefined;

  motivationMessageTimer: NodeJS.Timeout | undefined;
  private readonly motivationalMessages: string[] = [
    'Keep going!',
    'Dont give up!',
    'Keep it up!',
    'You can do it!',
    'Lets go!',
  ];

  private createAudioMeter(
    audioContext: AudioContext,
    clipLevel?: number,
    averaging?: number,
    clipLag?: number,
  ): ScriptProcessorNode {
    // around 10ms per 512
    this.processor = audioContext.createScriptProcessor(512 * 2) as ScriptProcessorNodeMod;
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
    this.processor.clipLevel = clipLevel || 0.74;
    this.processor.averaging = averaging || 0.97;
    this.processor.clipLag = clipLag || 1500;

    // get canvas
    this.canva = document.getElementById('meter') as HTMLCanvasElement;
    this.processor.canva = this.canva!;
    this.processor.meterCtx = this.canva!.getContext('2d')!;

    // get spinner
    this.spinner = document.getElementById('spinner') as HTMLDivElement;
    this.processor.spinner = this.spinner!;
    this.processor.spinnerRotationDegree = 0;

    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    this.processor.connect(audioContext.destination);

    this.processor.checkClipping = function (): boolean {
      if (!this.clipping) {
        return false;
      }
      if (this.lastClip + this.clipLag < window.performance.now()) {
        this.clipping = false;
      }
      return this.clipping;
    };

    this.processor.shutdown = function (): void {
      this.disconnect();
      this.onaudioprocess = null;
    };

    this.processor.onLoudListener = () => {
      this.aboveThresholdListener();
    };

    return this.processor;
  }

  private volumeAudioProcess(this: ScriptProcessorNodeMod, event: AudioProcessingEvent): void {
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
    const rms = Math.sqrt(sum / bufLength) * 2;
    this.volume = Math.max(rms, this.volume * this.averaging);

    // draw meter
    this.meterCtx.fillStyle = 'black';
    this.meterCtx.fillRect(0, 0, this.canva.width, this.canva.height);
    this.meterCtx.fillStyle = this.checkClipping() ? 'red' : 'green';
    this.meterCtx.fillRect(
      0,
      this.canva.height - this.canva.height * this.volume * 1.5,
      this.canva.width,
      this.canva.height * this.volume * 1.5,
    );
    // (this.spinner.style as any)['animation-duration'] = `${5000 * (1 - rms)}ms`;

    // clearInterval(this.animationPointer);
    // // Change spinner speed
    // this.animationPointer = setInterval(() => {
    this.spinnerRotationDegree = (2 + this.volume * 50 + this.spinnerRotationDegree) % 360;
    this.spinner.style.transform = 'rotate(' + this.spinnerRotationDegree + 'deg)';
    // }, 16);
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

      // Fire motivational messages every 30 seconds
      this.motivationMessageTimer = setInterval(() => {
        const messageBoard = document.getElementById('motivation') as HTMLElement;
        // Choose a message to be the text for the pop up
        messageBoard.innerText = this.motivationalMessages[Math.floor(Math.random() * 5)];
        messageBoard.style.opacity = '1'; // Make it appear

        // appear for 5 seconds, then hide it
        setTimeout(() => {
          messageBoard.style.opacity = '0';
        }, 5000);
      }, 30000);
    } else {
      throw MEDIA_RECORD_UNDEFINED_ERROR;
    }
  }

  stopRecording(): void {
    if (typeof this.motivationMessageTimer !== 'undefined') {
      clearInterval(this.motivationMessageTimer);
    }
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
        dataBuffer.push(ev.data);
      };
      this.mediaRecorder.onstop = ev => {
        const blob = new Blob(dataBuffer, { type: 'video/mp4;' });
        dataBuffer.splice(0);
        const videoURL = this.sanitize(window.URL.createObjectURL(blob));
        this.store.dispatch(
          INITIATE_UPLOAD({
            blobFile: blob,
            filename: undefined,
            videoURL,
          }),
        );
      };
    });
  }
  shutdown(): void {
    // this.processor?.shutdown();
    // this.videoPreviewHTML?.pause();
    // this.audioMeter?.disconnect();
    // this.audioContext?.close();
  }

  sanitize(url: string | undefined | null): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url || '');
  }
}

declare type ScriptProcessorNodeMod = ScriptProcessorNode & {
  clipping: boolean;
  lastClip: number;
  volume: number;
  clipLevel: number;
  averaging: number;
  clipLag: number;

  meterCtx: CanvasRenderingContext2D;
  canva: HTMLCanvasElement;
  spinner: HTMLDivElement;
  animationPointer: NodeJS.Timeout;
  spinnerRotationDegree: number;

  checkClipping: () => boolean;
  shutdown: () => void;

  onLoudListener: () => void;
};

const MEDIA_RECORD_UNDEFINED_ERROR = Error('MediaRecord is undefined');
