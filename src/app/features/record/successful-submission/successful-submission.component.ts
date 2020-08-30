import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { REDO } from '@core/actions';

@Component({
  selector: 'app-successful-submission',
  templateUrl: './successful-submission.component.html',
  styleUrls: ['./successful-submission.component.scss'],
})
export class SuccessfulSubmissionComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {}

  backToRecord() {
    this.store.dispatch(REDO());
  }
}
