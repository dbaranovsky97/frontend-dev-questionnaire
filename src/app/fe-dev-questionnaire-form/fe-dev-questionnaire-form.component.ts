import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { FrontendDevsDataService } from './frontend-devs-data.service';
import { IsEmailExistsValidator } from './email-exists.validator';
import frameworks from './frameworks-data';
import { Hobby } from './hobby-form/hobby';
import { HobbyFormComponent } from './hobby-form/hobby-form.component';

@Component({
  selector: 'app-fe-dev-questionnaire-form',
  templateUrl: './fe-dev-questionnaire-form.component.html',
  styleUrls: ['./fe-dev-questionnaire-form.component.scss']
})
export class FeDevQuestionnaireFormComponent implements OnInit, OnDestroy {
  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    framework: ['', [Validators.required]],
    frameworkVersion: [{ value: '', disabled: true }, [Validators.required]],
    email: ['', [Validators.required, Validators.email], [this.isEmailExistsValidator]],
    hobby: [[], [Validators.required]]
  });

  //#region Form Controls Accessors 
  get firstName() {
    return <AbstractControl>this.form.get('firstName');
  }

  get lastName() {
    return <AbstractControl>this.form.get('lastName');
  }

  get dateOfBirth() {
    return <AbstractControl>this.form.get('dateOfBirth');
  }

  get framework() {
    return <AbstractControl>this.form.get('framework');
  }

  get frameworkVersion() {
    return <AbstractControl>this.form.get('frameworkVersion');
  }

  get email() {
    return <AbstractControl>this.form.get('email');
  }

  get hobby() {
    return <AbstractControl>this.form.get('hobby');
  }
  //#endregion

  frameworks = frameworks;
  availableFrameworkVersions: string[] = [];

  private unsubscribeOnDestroy: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<FeDevQuestionnaireFormComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private feDevsDataService: FrontendDevsDataService,
    private isEmailExistsValidator: IsEmailExistsValidator,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    const frameworkChangedSubscription = this.framework.valueChanges
      .subscribe(frameworkName => this.updateAvailableFrameworkVersions(frameworkName));

    this.unsubscribeOnDestroy.push(frameworkChangedSubscription);
  }

  ngOnDestroy(): void {
    this.unsubscribeOnDestroy.forEach(s => s.unsubscribe());
  }

  addHobby() {
    const hobbyDialogRef = this.dialog.open(HobbyFormComponent, {
      width: '300px'
    });

    const dialogClosedSubscription = hobbyDialogRef.afterClosed()
      .subscribe(hobby => {
        if (hobby && hobby.name && hobby.duration) {
          this.hobby.setValue([...this.hobby.value, hobby]);
        }
      });

    this.unsubscribeOnDestroy.push(dialogClosedSubscription);
  }

  removeHobby(hobby: Hobby) {
    const newValue = (<Hobby[]>this.hobby.value).filter(h => h != hobby);
    this.hobby.setValue(newValue);
  }

  save() {
    if (this.form.valid) {
      const value = this.form.value;
      this.form.disable();
      const questionnaireSavedSubscription = this.feDevsDataService.saveQuestionnaire(value)
        .subscribe(
          next => {
            this.dialogRef.close();
            this.snackBar.open('Saved successfully', 'Ok');
          },
          error => {
            console.error(error);
            this.snackBar.open('Error occured', 'Ok');
          },
        );

      this.unsubscribeOnDestroy.push(questionnaireSavedSubscription);
    }
  }

  getErrorMessage(formControl: AbstractControl, controlType: 'text' | 'date' | 'select' = 'text') {
    if (formControl.hasError('required')) {
      if (controlType === 'text') {
        return 'You must enter a value';
      } else if (controlType === 'date') {
        return 'You must choose a date';
      } else if (controlType === 'select') {
        return 'You must choose an option';
      }
    } else if (formControl.hasError('email')) {
      return 'Wrong email addres';
    } else if (formControl.hasError('isEmailExists')) {
      return 'Email already exists';
    }

    return 'Unknown error';
  }

  private updateAvailableFrameworkVersions(frameworkName: string) {
    if (this.frameworkVersion.disabled) {
      this.frameworkVersion.enable();
    }

    const framework = frameworks.find(fw => fw.name === frameworkName);
    this.availableFrameworkVersions = framework?.versions || [];
    this.frameworkVersion.setValue(null);
  }

}
