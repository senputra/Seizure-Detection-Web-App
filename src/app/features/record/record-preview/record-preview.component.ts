import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPreviewVideoURL } from '@core/reducers/recording.reducer';
import { tap, filter } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-record-preview',
  templateUrl: './record-preview.component.html',
  styleUrls: ['./record-preview.component.scss'],
})
export class RecordPreviewComponent implements OnInit {
  previewURL$: Observable<string | undefined>;

  constructor(private store: Store, private sanitizer: DomSanitizer) {
    this.previewURL$ = this.store.select(selectPreviewVideoURL).pipe(
      tap(url => console.log(url)),
      filter(url => !!url),
    );
  }

  ngOnInit() {}

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
