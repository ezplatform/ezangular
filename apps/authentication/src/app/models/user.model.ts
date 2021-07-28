export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

export class User {
  public uid?: string;
  public email?: string;
  public displayName?: string;
  public photoURL?: string;
  public emailVerified?: boolean;

  constructor(user?: IUser) {
    if (user) {
      this.uid = user.uid;
      this.email = user.email;
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
      this.emailVerified = user.emailVerified;
    }
  }
}
