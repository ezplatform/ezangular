import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SignUpComponent } from './sign-up.component';

@NgModule({
  declarations: [SignUpComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: SignUpComponent }])]
})
export class SignUpModule {}
