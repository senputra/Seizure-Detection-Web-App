import { Injectable } from '@angular/core';
import { RecordingDoc } from '../models/recording.model';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { generateId } from '@core/utils/random-generator';
@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private afs: AngularFirestore) {}

  submitRecording(data: RecordingDoc): void {
    const id = generateId();
    this.afs
      .collection('recordings')
      .doc(id)
      .set({
        ...data,
        id,
      });
  }

  loadAll(): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs.collection('recordings').snapshotChanges();
  }
}
