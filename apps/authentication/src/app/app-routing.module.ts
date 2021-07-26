import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'forgot-password',
    loadChildren: async () => (await import('./features/forgot-password/forgot-password.module')).ForgotPasswordModule
  },
  {
    path: 'sign-in',
    loadChildren: async () => (await import('./features/sign-in/sign-in.module')).SignInModule
  },
  {
    path: 'sign-up',
    loadChildren: async () => (await import('./features/sign-up/sign-up.module')).SignUpModule
  },
  {
    path: 'verify-email',
    loadChildren: async () => (await import('./features/verify-email/verify-email.module')).VerifyEmailModule
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/sign-up'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
