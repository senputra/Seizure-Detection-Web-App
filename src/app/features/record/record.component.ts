import { Component, OnInit } from '@angular/core';
import { RecordService } from '@core/services/recorder.service';
import { Store } from '@ngrx/store';
import { LOAD_RECORDER, START_RECORDING, STOP_RECORDING } from '@core/actions';
import { Observable } from 'rxjs';
import {
  selectRecordingState,
  selectIsRecording,
  selectMinLeft,
  selectSecsLeft,
} from '@core/reducers/recording.reducer';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
})
export class RecordComponent implements OnInit {
  constructor(private store: Store) {
    this.isRecording$ = this.store.select(selectIsRecording);

    this.min$ = this.store
      .select(selectMinLeft)
      .pipe(map((nu: number) => (nu < 10 ? `0${nu}` : '' + nu)));
    this.secs$ = this.store
      .select(selectSecsLeft)
      .pipe(map((nu: number) => (nu < 10 ? `0${nu}` : '' + nu)));
  }

  min$: Observable<string>;
  secs$: Observable<string>;
  isRecording$: Observable<boolean>;

  ngOnInit(): void {
    this.store.dispatch(
      LOAD_RECORDER({
        videoPreviewId: 'preview',
      }),
    );
  }

  startRecording(): void {
    this.store.dispatch(START_RECORDING());
  }
  stopRecording(): void {
    this.store.dispatch(STOP_RECORDING());
  }
}
