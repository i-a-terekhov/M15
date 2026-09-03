import { Component, HostListener } from '@angular/core';
import { AuthService } from "../../../core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
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
  userName: string = '';
  isBurgerOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
  ) {
    this.isLoggedIn = authService.getIsLoggedIn();
  }

  ngOnInit(): void {
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

  getUserName(): void {
    this.userService.getUserInfo()
      .subscribe((data: DefaultResponseType | UserInfoType) => {
        if ('error' in data) {
          throw new Error(data.message);
        } else {
          this.userName = data.name;
        }
      });
  }

  login(): void {
    let excludedPaths = ['/login', '/signup'];
    let url = this.router.url;

    if (url && !excludedPaths.includes(url)) {
      this.authService.pageBeforeLogin = url;
    }
    this.router.navigate(['/login']);
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
  }

  toggleBurger(event: MouseEvent): void {
    event.stopPropagation();
    this.isBurgerOpen = !this.isBurgerOpen;
  }

  @HostListener('document:click')
  closeBurger(): void {
    if (this.isBurgerOpen) {
      this.isBurgerOpen = false;
    }
  }
}
