import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../api/auth.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  Rest = inject(AuthService);
  email: string = '';
  password: string = '';
  acceptTerms: boolean = false;

  Error: string = '';

  constructor(private router: Router, private cookieService: CookieService) {}

  onLogin(event: Event) {
    event.preventDefault();
    console.log(this.acceptTerms);
    
    this.Error = '';


    if (!this.email || this.email.trim() === '') {
      this.Error = 'Email is required';
      return;
    }

    if (!this.password || this.password.trim() === '') {
      this.Error = 'Password is required';
      return;
    }


    if (!this.isValidEmail(this.email)) {
      this.Error = 'Please enter a valid email address';
      return;
    }

    if (!this.isValidPassword(this.password)) {
      this.Error = 'Password must contain at least 6 characters, including letters and numbers';
      return;
    }

    if (!this.acceptTerms) {
      this.Error = 'You must accept Terms of Service';
      return;
    }
    this.Error = '';

    this.Rest.PostLogin(this.email, this.password).subscribe({
      next: (response) => {
        const token = response.cookie;
        this.cookieService.set('_ASA', token, undefined, '/', 'localhost', true, 'Strict');
        this.router.navigate(['home']);
      },
      error: (error) => {
        if (error.status === 429) {
          this.Error = 'Too many requests. Please try again later.';
        } else {
          const errorMessage = error.error?.message || error.message;
          this.Error = errorMessage;
        }
      }
    });


    //this.router.navigate(['/select-bank']);
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  isValidPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 6;

    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
  }
}