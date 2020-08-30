import { Injectable } from '@angular/core';
import { RecordingDoc } from '../models/recording.model';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private afs: AngularFirestore) {}

  submitRecording(data: RecordingDoc): void {
    this.afs.collection('recordings').add(data);
  }
}
