import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn, } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {//add constructor 
  profileForm: FormGroup;

  constructor(private auth: FirebaseService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, ValidateEmail]],
      password: ['', [Validators.required, Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')]],

      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],

    });

  }

  ngOnInit(): void {

  }

  onSubmit() {
    // On clicking the submit button, the register method is called
    console.log('Form submitted:', this.profileForm.value);
    this.auth.register(this.profileForm.value.email, this.profileForm.value.password);
    this.profileForm.reset();
  }
}

// custom validators for email
export function ValidateEmail(control: AbstractControl) {
  if (!control.value.includes('@75f.io')) {
    return { invalid: true };
  }
  return null;
}

