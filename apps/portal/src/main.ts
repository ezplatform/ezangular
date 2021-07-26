import { enableProdMode, NgModuleRef } from '@angular/core';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS, FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerApplication, start } from 'single-spa';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { constructApplications, constructLayoutEngine, constructRoutes } from 'single-spa-layout';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as layout from './single-spa/layout.html';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(getSingleSpaExtraProviders())
  .bootstrapModule(AppModule)
  .then(({ injector }: NgModuleRef<AppModule>) => {
    const options = injector.get(FIREBASE_OPTIONS, {});
    const appName = injector.get(FIREBASE_APP_NAME, '');
    const app = injector.get(FirebaseApp);
    const auth = injector.get(AngularFireAuth);
    const routes = constructRoutes((layout as unknown as { default: string }).default, {
      loaders: {},
      props: {
        firebase: {
          options,
          appName,
          app,
          auth
        }
      }
    });
    const applications = constructApplications({
      routes,
      loadApp({ name }) {
        return System.import(name);
      }
    });
    const layoutEngine = constructLayoutEngine({ routes, applications });

    applications.forEach(registerApplication);
    layoutEngine.activate();
    start();
  })
  .catch(err => console.error(err));
