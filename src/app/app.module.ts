import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FeDevQuestionnaireFormComponent } from './fe-dev-questionnaire-form/fe-dev-questionnaire-form.component';
import { HobbyFormComponent } from './fe-dev-questionnaire-form/hobby-form/hobby-form.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    FeDevQuestionnaireFormComponent,
    HobbyFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
