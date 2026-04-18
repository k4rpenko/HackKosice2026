import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent {
  user = {
    name: 'Bob',
    email: 'bob.dev@example.com',
    avatar: 'JD',
    joined: 'April 2026'
  };

  linkedBanks = [
    { name: 'Monobank', icon: '🏦', status: 'Connected' },
    { name: 'Revolut', icon: '💳', status: 'Connected' }
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  addBank() {
    alert('Redirecting to bank selection...');
  }

  logout() {
    this.router.navigate(['/']);
  }
}