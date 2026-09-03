import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../core/auth/auth.service";
import { LoginResponseType } from "../../../../types/login-response.type";
import { DefaultResponseType } from "../../../../types/default-response.type";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { InputErrorType } from "../../../../types/inputs-error.type";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  protected readonly InputErrorType = InputErrorType;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    rememberMe: [false],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router,
  ) {
  }

  isFieldInvalid(fieldName: string, errorType?: InputErrorType): boolean {
    const input = this.loginForm.get(fieldName);
    const isInvalid = !!(input && input.invalid && (input.dirty || input.touched));

    if (!isInvalid) {
      return false;
    }

    if (errorType) {
      return input.hasError(errorType)
    }

    return true;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
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
            this.snackBar.open('Вы успешно авторизовались');
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
          }
        })
    }
  }
}
