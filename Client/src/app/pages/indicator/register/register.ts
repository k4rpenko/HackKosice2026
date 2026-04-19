import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../../api/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  Rest = inject(AuthService);
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  password2: string = '';
  acceptTerms: boolean = false;

  Error: string = '';

  constructor(private router: Router, private cookieService: CookieService) {}

  onRegister(event: Event) {
    this.router.navigate(['/select-bank']);
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

    if (!this.password2 || this.password2.trim() === '') {
      this.Error = 'Confirm password is required';
      return;
    }

    if (this.password !== this.password2) {
      this.Error = 'Passwords do not match';
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


    // this.Rest.PostRegister(this.email, this.password, this.firstName, this.lastName).subscribe({
    //   next: (response) => {
    //     const token = response.cookie;
    //     this.cookieService.set('_ASA', token, undefined, '/', 'localhost', true, 'Strict');
    //     this.router.navigate(['home']);
    //   },
    //   error: (error) => {
    //     if (error.status === 429) {
    //       this.Error = 'Too many requests. Please try again later.';
    //     } 
    //     else if(error.status === 400){
    //       this.Error = 'This email address is already taken, please try another one.';
    //     }
    //     else {
    //       const errorMessage = error.error?.message || error.message;
    //       this.Error = errorMessage;
    //     }
    //   }
    // });

    this.router.navigate(['/select-bank']);
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