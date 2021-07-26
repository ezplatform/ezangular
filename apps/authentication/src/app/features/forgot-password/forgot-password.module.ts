import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ForgotPasswordComponent }])]
})
export class ForgotPasswordModule {}
