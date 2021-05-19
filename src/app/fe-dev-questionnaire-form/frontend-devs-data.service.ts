import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { FEDevQuestionnaire } from './fe-dev-questionnaire';

type FEDevQuestionnaireDto = Omit<FEDevQuestionnaire, 'dateOfBirth'> & { dateOfBirth: string };

@Injectable({
  providedIn: 'root'
})
export class FrontendDevsDataService {
  saveQuestionnaire(formValue: FEDevQuestionnaire): Observable<boolean> {
    const dto = this.mapQuestionnaireToDto(formValue);
    console.log('SAVING RESULT:', dto);
    return of(true);
  }

  isEmailExists(email: string): Observable<boolean> {
    return timer(2000)
      .pipe(
        map(_ => email === 'test@test.test')
      );
  }

  private mapQuestionnaireToDto(formValue: FEDevQuestionnaire): FEDevQuestionnaireDto {
    const { dateOfBirth } = formValue;
    const dateOfBirthString = `${dateOfBirth.getDate()}-${dateOfBirth.getMonth()+1}-${dateOfBirth.getFullYear()}`;
    
    return {
      ...formValue,
      dateOfBirth: dateOfBirthString
    };
  }
}
