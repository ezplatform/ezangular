import { enableProdMode, NgZone } from '@angular/core';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS, FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NavigationStart, Router } from '@angular/router';
import { getSingleSpaExtraProviders, singleSpaAngular } from 'single-spa-angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { FirebaseProps, SingleSpaProps, singleSpaPropsSubject } from './single-spa/single-spa-props';

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular<SingleSpaProps>({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    const { options, appName, app, auth } = singleSpaProps.firebase as FirebaseProps;
    return platformBrowserDynamic([
      ...getSingleSpaExtraProviders(),
      // AngularFireModule
      { provide: FIREBASE_OPTIONS, useExisting: options },
      { provide: FIREBASE_APP_NAME, useExisting: appName },
      { provide: FirebaseApp, useExisting: app },
      // AngularFireAuthModule
      { provide: AngularFireAuth, useExisting: auth }
    ]).bootstrapModule(AppModule);
  },
  template: '<ezfinhub-authentication />',
  Router,
  NavigationStart,
  NgZone
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
