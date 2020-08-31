import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { LOAD_ALL } from '@core/actions';
import { Store } from '@ngrx/store';
import { selectAllEntities } from '@core/reducers/recording.reducer';
import { RecordingDoc } from '@core/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-record-dashboard',
  templateUrl: './record-dashboard.component.html',
  styleUrls: ['./record-dashboard.component.css'],
})
export class RecordDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['Date', 'Name', 'Age', 'Doctor Name', 'Priority'];
  dataSource = new MatTableDataSource<RecordingDoc>([]);
  subs: Subscription[] = [];
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(LOAD_ALL());
  }

  ngAfterViewInit() {
    this.subs.push(
      this.store.select(selectAllEntities).subscribe((docArray: RecordingDoc[]) => {
        this.dataSource = new MatTableDataSource(docArray);
        this.dataSource.sort = this.sort;
      }),
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  convertDate(secs: number) {
    return new Date(secs * 1000);
  }
}
