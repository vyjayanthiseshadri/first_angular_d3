import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

export const authguardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const firebaseService = inject(FirebaseService);

  const status = sessionStorage.getItem('LoginStatus');
  // If it is Authenticated properly then set the loginStatus variable to true

    if (status == "true") {
      return true;
    }
    else {
      router.navigate(['/login']);
      return false;
    }



};
