import { Component } from '@angular/core';
import { AuthService } from "../../../core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { DefaultResponseType } from "../../../../types/default-response.type";
import { UserInfoType } from "../../../../types/user-info.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isLoggedIn: boolean = false;
  userName = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
  ) {
    this.isLoggedIn = authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.getUserName();
      }
    });

    if (this.isLoggedIn) {
      this.getUserName();
    }
  }

  getUserName() {
    this.userService.getUserInfo()
      .subscribe((data: DefaultResponseType | UserInfoType) => {
        if ('error' in data) {
          throw new Error(data.message);
        } else {
          this.userName = data.name;
        }
      });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        },
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.isLoggedIn = false;
    this.userName = '';
    this.snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
