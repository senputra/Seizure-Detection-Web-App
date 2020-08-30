import { Component, OnInit } from '@angular/core';
import { RecordService } from '@core/services/recorder.service';
import { Store } from '@ngrx/store';
import { LOAD_RECORDER, START_RECORDING, STOP_RECORDING } from '@core/actions';
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
})
export class RecordComponent implements OnInit {
  constructor(private store: Store) {}

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
