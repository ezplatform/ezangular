import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [BrowserModule, AppRoutingModule],
  declarations: [AppComponent],
  providers: [{ provide: APP_BASE_HREF, useValue: '/auth' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
