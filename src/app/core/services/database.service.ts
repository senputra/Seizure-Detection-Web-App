import { Injectable } from '@angular/core';
import { RecordingDoc } from '../models/recording.model';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { generateId } from '@core/utils/random-generator';
import { map } from 'rxjs/operators';
import { FirestoreAuth, DoctorType } from '@core/models';
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

  deleteDoc(id: string): void {
    this.afs.collection('recordings').doc(id).delete();
  }

  getDoctorTypeFromKey(key: string): Observable<DoctorType> {
    return this.afs
      .collection('auth')
      .doc(key)
      .get()
      .pipe(
        map(data => {
          const d = data.data() as FirestoreAuth | undefined;
          if (typeof d === 'undefined') {
            return DoctorType.NON;
          } else {
            return d.doctorType;
          }
        }),
      );
  }

  submitDoctorType(key: string, doctorType: DoctorType): void {
    const model: FirestoreAuth = {
      key,
      doctorType,
    };
    this.afs.collection('auth').doc(key).set(model);
  }

  loadAllDoctorType(): Observable<unknown[]> {
    return this.afs.collection('auth').valueChanges();
  }

  removeKey(key: string): void {
    this.afs.collection('auth').doc(key).delete();
  }
}
