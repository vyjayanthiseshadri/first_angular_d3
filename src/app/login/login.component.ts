import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router, 
    private auth: FirebaseService, private commonService: CommonService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, ValidateEmail]],
      password: ['', [Validators.required, Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')]],

    });
  }
  ngOnInit(): void {
    this.commonService.showPie.next(false);
    this.commonService.showBar.next(false);
    this.commonService.showScatter.next(false);
    this.commonService.showDonut.next(false);

  }


  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
    //Validates email and password by using Firebase Services
    this.auth.login(this.loginForm.value.email, this.loginForm.value.password);

    // Resets the email and password to empty string after authentication
  this.loginForm.reset();
  }

  // Navigates to the signup page
  signup() {
    this.router.navigate(['/signup']);
  }

  // ngOnDestroy() {
  //   this.commonService.showFooter.next(true);
  // }

}

// Custom Validation for email
export function ValidateEmail(control: AbstractControl) {
  if (!control.value.includes('@75f.io')) {
    return { invalid: true };
  }
  return null;
}








