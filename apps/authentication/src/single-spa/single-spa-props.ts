import { FirebaseApp, FirebaseAppConfig, FirebaseOptions } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { ReplaySubject } from 'rxjs';
import { AppProps } from 'single-spa';

export interface FirebaseProps {
  options: FirebaseOptions;
  appName: string | FirebaseAppConfig;
  app: FirebaseApp;
  auth: AngularFireAuth;
}

export const singleSpaPropsSubject = new ReplaySubject<SingleSpaProps>(1);

// Add any custom single-spa props you have to this type def
// https://single-spa.js.org/docs/building-applications.html#custom-props
export type SingleSpaProps = AppProps & Record<string, unknown>;
