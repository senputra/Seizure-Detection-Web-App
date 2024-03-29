// import { NgModule } from '@angular/core';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatBadgeModule } from '@angular/material/badge';
// import { MatButtonModule } from '@angular/material/button';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatRippleModule } from '@angular/material/core';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatSortModule } from '@angular/material/sort';
// import { MatTableModule } from '@angular/material/table';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatTreeModule } from '@angular/material/tree';

// @NgModule({
// 	imports: [
// 		MatAutocompleteModule,
// 		MatBadgeModule,
// 		MatButtonModule,
// 		MatButtonToggleModule,
// 		MatCardModule,
// 		MatCheckboxModule,
// 		MatChipsModule,
// 		MatStepperModule,
// 		MatDatepickerModule,
// 		MatDialogModule,
// 		MatExpansionModule,
// 		MatFormFieldModule,
// 		MatGridListModule,
// 		MatIconModule,
// 		MatInputModule,
// 		MatListModule,
// 		MatMenuModule,
// 		MatPaginatorModule,
// 		MatProgressBarModule,
// 		MatProgressSpinnerModule,
// 		MatRadioModule,
// 		MatRippleModule,
// 		MatSelectModule,
// 		MatSidenavModule,
// 		MatSliderModule,
// 		MatSlideToggleModule,
// 		MatSnackBarModule,
// 		MatSortModule,
// 		MatTableModule,
// 		MatTabsModule,
// 		MatToolbarModule,
// 		MatTooltipModule,
// 		MatTreeModule,
// 		MatNativeDateModule,
// 	],
// 	exports: [
// 		MatAutocompleteModule,
// 		MatBadgeModule,
// 		MatButtonModule,
// 		MatButtonToggleModule,
// 		MatCardModule,
// 		MatCheckboxModule,
// 		MatChipsModule,
// 		MatStepperModule,
// 		MatDatepickerModule,
// 		MatDialogModule,
// 		MatExpansionModule,
// 		MatFormFieldModule,
// 		MatGridListModule,
// 		MatIconModule,
// 		MatInputModule,
// 		MatListModule,
// 		MatMenuModule,
// 		MatPaginatorModule,
// 		MatProgressBarModule,
// 		MatProgressSpinnerModule,
// 		MatRadioModule,
// 		MatRippleModule,
// 		MatSelectModule,
// 		MatSidenavModule,
// 		MatSliderModule,
// 		MatSlideToggleModule,
// 		MatSnackBarModule,
// 		MatSortModule,
// 		MatTableModule,
// 		MatTabsModule,
// 		MatToolbarModule,
// 		MatTooltipModule,
// 		MatTreeModule,
// 		MatNativeDateModule,
// 	],
// 	providers: [],
// })
// export class MaterialModule {}
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  exports: [
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  providers: [],
})
export class MaterialModule {}
