import { Injectable, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { generateId } from '../utils/random-generator';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ListResult } from '@angular/fire/storage/interfaces';
import { Logger } from '@core/devServices/logger.service';

@Injectable({ providedIn: 'root' })
export class CloudStorageService {
  private logger: Logger;
  constructor(private storage: AngularFireStorage) {
    this.logger = new Logger('cloud service');
  }

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

  remove(path: string): void {
    this.storage.ref(path).delete();
  }

  getAllPath(): Observable<string[]> {
    return this.storage
      .ref('recording')
      .listAll()
      .pipe(map((listResults: ListResult) => listResults.items.map(item => `${item.fullPath}`)));
  }
}
