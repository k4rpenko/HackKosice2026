import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  pass: string = '';

  constructor(private router: Router) {}

  onLogin() {
    this.router.navigate(['/bank-setup']);
  }

  loginWithGoogle() {
    console.log('Google Auth Triggered');
    this.router.navigate(['/bank-setup']);
  }
}