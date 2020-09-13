import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FirestoreAuth } from '@core/models';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { DatabaseService } from '@core/services/database.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss'],
})
export class AdminConsoleComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['key', 'doctorType', 'action'];
  dataSource = new MatTableDataSource<FirestoreAuth>([]);
  subs: Subscription[] = [];
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private db: DatabaseService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.subs.push(
      this.db.loadAllDoctorType().subscribe((keyArray: unknown[]) => {
        this.dataSource = new MatTableDataSource(keyArray as FirestoreAuth[]);
        this.dataSource.sort = this.sort;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  convertDate(secs: number): Date {
    return new Date(secs * 1000);
  }

  click(obj: FirestoreAuth): void {
    console.log(obj);
  }

  remove(key: string): void {
    this.db.removeKey(key);
  }

  newKey(): void {
    console.log('key');
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewKeyDialogComponent, {
      width: '500px',
      data: {},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: FirestoreAuth | undefined) => {
      if (typeof result !== 'undefined') {
        this.db.submitDoctorType(result.key, result.doctorType);
      }
    });
  }
}

@Component({
  template: `
    <h1 mat-dialog-title>Add new secret key</h1>
    <div
      mat-dialog-content
      style="display:flex;    f
        lex-flow: row;
        justify-content: space-around;"
    >
      <mat-form-field>
        <mat-label>Secret Key</mat-label>
        <input matInput [(ngModel)]="data.key" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Select doctor type</mat-label>
        <mat-select [(ngModel)]="data.doctorType">
          <mat-option value="GENERAL">
            GENERAL
          </mat-option>
          <mat-option value="SPECIALIST">
            SPECIALIST
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button
        mat-raised-button
        [mat-dialog-close]="data"
        [disabled]="!(data.key && data.doctorType)"
        color="primary"
      >
        Submit
      </button>
    </div>
  `,
})
// tslint:disable-next-line: component-class-suffix
export class NewKeyDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NewKeyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FirestoreAuth,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }
}
