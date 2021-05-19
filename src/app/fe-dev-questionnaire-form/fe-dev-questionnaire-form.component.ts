import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class FeDevQuestionnaireFormComponent implements OnInit {
  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    framework: ['', [Validators.required]],
    frameworkVersion: [{ value: '', disabled: true }, [Validators.required]],
    email: ['', [Validators.required, Validators.email], [this.isEmailExistsValidator]],
    hobby: [[], [Validators.required]]
  });

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

  frameworks = frameworks;
  frameworkVersions: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<FeDevQuestionnaireFormComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private feDevsDataService: FrontendDevsDataService,
    private isEmailExistsValidator: IsEmailExistsValidator,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.framework.valueChanges
      .subscribe(frameworkName => {
        if (this.frameworkVersion.disabled) {
          this.frameworkVersion.enable();
        }

        const framework = frameworks.find(fw => fw.name === frameworkName);
        this.frameworkVersions = framework?.versions || [];
        this.frameworkVersion.setValue(null);
      });
  }

  save() {
    if (this.form.valid) {
      const value = this.form.value;
      this.form.disable();
      this.feDevsDataService.saveQuestionnaire(value)
        .subscribe(
          next => {
            this.dialogRef.close();
            this.snackBar.open('Saved successfully', 'Ok');
          },
          error => {
            this.form.enable();
            console.error(error);
            this.snackBar.open('Error occured', 'Ok');
          },
        );
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

  addHobby() {
    const hobbyDialogRef = this.dialog.open(HobbyFormComponent, {
      width: '300px'
    });

    hobbyDialogRef.afterClosed().subscribe(hobby => {
      if (hobby && hobby.name && hobby.duration) {
        this.hobby.setValue([...this.hobby.value, hobby]);
      }
    });
  }

  removeHobby(hobby: Hobby) {
    const newValue = (<Hobby[]>this.hobby.value).filter(h => h != hobby);
    this.hobby.setValue(newValue);
  }

}
