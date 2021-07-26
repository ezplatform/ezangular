import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VerifyEmailComponent } from './verify-email.component';

@NgModule({
  declarations: [VerifyEmailComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: VerifyEmailComponent }])]
})
export class VerifyEmailModule {}
