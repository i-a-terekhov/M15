import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { DefaultResponseType } from "../../../../types/default-response.type";
import { LoginResponseType } from "../../../../types/login-response.type";
import { InputErrorType } from "../../../../types/inputs-error.type";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  protected readonly InputErrorType = InputErrorType;

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s[А-ЯЁ][а-яё]*)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    agree: [false, [Validators.requiredTrue]],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router,
  ) {
  }

  isFieldInvalid(fieldName: string, errorType?: InputErrorType): boolean {
    const input = this.signupForm.get(fieldName);
    const isInvalid = !!(input && input.invalid && (input.dirty || input.touched));

    if (!isInvalid) {
      return false;
    }

    if (errorType) {
      return input.hasError(errorType)
    }

    return true;
  }

  signup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email
      && this.signupForm.value.password && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this.snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this.snackBar.open('Вы успешно зарегистрировались');
            if (this.authService.pageBeforeLogin) {
              this.router.navigate([this.authService.pageBeforeLogin])
            } else {
              this.router.navigate(['/']);
            }

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Ошибка соединения');
            }
          },
        });
    }
  }
}
