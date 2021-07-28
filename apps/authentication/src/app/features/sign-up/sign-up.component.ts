import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent implements OnInit {
  public signUpForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // TODO
  }

  public ngOnInit(): void {
    this.signUpForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  public registerUser(): void {
    this.authService.signUp('phongcao3091998@gmail.com', 'ABC123');
  }
}
