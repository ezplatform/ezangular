import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons.module';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, NzLayoutModule, NzMenuModule, IconsProviderModule],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
