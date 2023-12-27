// FIREBASE SERVICE PAGE

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  LoginStatus:boolean = false;
  //initialize the login status variable as false initially

  constructor(private fireauth:AngularFireAuth, private router:Router) { }

  //login method
  login(email:string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email,password).then( ()=>{
      // If the authentication is successful, the then block is executed, which includes:
     // Setting an item in the local storage to indicate that the user is logged in 
      // localStorage.setItem('token','true');

      //If the email and password is correct then go to details(orders)page
      this.router.navigateByUrl('/landing');
      sessionStorage.setItem('LoginStatus','true');
      // this.LoginStatus = true;//Implementing auth-guard
      alert('Login Successful');//And display login successful alert
    },  err =>{
      alert('err.message');//else display error message
      this.router.navigateByUrl('/login');//stay in login page only
      
    })

  }

  //signup method
  register(email:string,password:string){
    this.fireauth.createUserWithEmailAndPassword(email,password).then(()=>{
      this.router.navigateByUrl('/landing');
      alert('Registration Successful');
    },err =>{
      alert('err.message');
      this.router.navigateByUrl('/signup');
    })
  }

  //sign out method
  logout() {

    confirm

    this.fireauth.signOut().then(()=>{
      sessionStorage.removeItem('LoginStatus');
      this.router.navigate(['/login']);
    },err =>{
      alert(err.message);
    }
    )
  }

}
