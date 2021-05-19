import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeDevQuestionnaireFormComponent } from './fe-dev-questionnaire-form/fe-dev-questionnaire-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private dialog: MatDialog
  ) {
  }

  openForm(): void {
    this.dialog.open(FeDevQuestionnaireFormComponent, {
      width: '500px',
      disableClose: true
    });
  }
}
