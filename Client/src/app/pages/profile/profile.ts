import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from "../../../components/header/header.component";

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, Header],
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

  linkedBanks: { name: string; status: string; logoSrc?: string; icon?: string }[] = [
    { name: 'Tatra banka', status: 'Connected', logoSrc: 'media/Tatra.png' },
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }

  addBank() {
    alert('Redirecting to bank selection...');
  }

  logout() {
    this.router.navigate(['/']);
  }
}