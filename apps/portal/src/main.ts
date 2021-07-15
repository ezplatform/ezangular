import * as layout from './single-spa/layout.html';

import { constructApplications, constructLayoutEngine, constructRoutes } from 'single-spa-layout';
import { registerApplication, start } from 'single-spa';

import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    const routes = constructRoutes((layout as unknown as { default: string }).default);
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
