import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailComponent {
  constructor() {
    // TODO
  }
}
