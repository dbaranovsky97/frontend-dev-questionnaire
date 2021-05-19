import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { FrontendDevsDataService } from "./frontend-devs-data.service";

@Injectable({ providedIn: 'root' })
export class IsEmailExistsValidator implements AsyncValidator {
    constructor(private feDevsDataService: FrontendDevsDataService) { }

    validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
        return this.feDevsDataService.isEmailExists(ctrl.value)
            .pipe(
                map(isEmailExists => (isEmailExists ? { isEmailExists: true } : null)),
                catchError(() => of(null))
            );
    }
}