import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-hobby-form',
  templateUrl: './hobby-form.component.html',
  styleUrls: ['./hobby-form.component.scss']
})
export class HobbyFormComponent implements OnInit {
  form = this.fb.group({
    name: ['', [Validators.required]],
    duration: ['', [Validators.required]],
  });

  get name() {
    return <AbstractControl>this.form.get('name');
  }

  get duration() {
    return <AbstractControl>this.form.get('duration');
  }
  
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

}
