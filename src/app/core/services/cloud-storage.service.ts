import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { generateId } from '../utils/random-generator';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloudStorageService {
  constructor(private storage: AngularFireStorage) {}

  uploadRecordingData(
    recordingBlob: Blob,
    filename: string | undefined,
  ): Observable<firebase.storage.UploadTaskSnapshot | undefined> {
    let ref;
    if (typeof filename === 'undefined') {
      ref = this.storage.ref(`recording/${Date.now()}_${generateId(6)}.mp4`);
    } else {
      ref = this.storage.ref(`recording/${filename}_${generateId(6)}.mp4`);
    }
    return ref.put(recordingBlob).snapshotChanges();
  }

  getDownloadURL(path: string): Observable<string> {
    return this.storage.ref(path).getDownloadURL();
  }

  remove(path: string) {
    this.storage.ref(path).delete();
  }
}
