import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerApplication, start } from 'single-spa';
import { constructApplications, constructLayoutEngine, constructRoutes } from 'single-spa-layout';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as layout from './single-spa/layout.html';

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
