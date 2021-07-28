import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { IUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData: User = new User();

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router, public ngZone: NgZone) {}

  public initUserData(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = new User(user as IUser);
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', '');
      }
    });
  }

  public signUp(email: string, password: string): Promise<void> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        console.log(result);
        //
        this.sendVerificationMail();
      })
      .catch(error => {
        throw error.message;
      });
  }

  public sendVerificationMail() {
    return this.afAuth.currentUser.then(user => {
      user?.sendEmailVerification();

      this.router.navigate(['verify-email-address']);
    });
  }
}
