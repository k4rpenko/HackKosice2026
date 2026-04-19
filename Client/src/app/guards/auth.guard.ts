import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.cookieService.get('_ASA');

    if (token && token.trim() !== '') {
      return true;
    }

    window.location.href = 'https://localhost:4200';
    return false;
  }
}