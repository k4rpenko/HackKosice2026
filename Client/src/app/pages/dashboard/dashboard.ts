import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  
  transactions = [
    {
      icon: '🛒',
      name: 'Lidl — Groceries',
      meta: 'Today, 14:32 · Revolut',
      amount: -487,
      type: 'negative'
    },
    {
      icon: '🍕',
      name: "Domino's — Dinner",
      meta: 'Yesterday, 20:15 · N26 · Shared',
      amount: -620,
      type: 'negative'
    },
    {
      icon: '💳',
      name: 'Transfer from Maria',
      meta: 'Yesterday, 18:00 · Revolut',
      amount: 250,
      type: 'positive'
    }
  ];

  debts = [
    { name: 'Oleg S.', reason: 'Food, 2 days ago', amount: 310 },
    { name: 'Maria P.', reason: 'Taxi, yesterday', amount: 290 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
        // Simulate fetching user data and transactions
  }

  remindUser(userName: string): void {
    console.log(`Notification sent to ${userName}`);
    alert(`Reminder sent to ${userName}!`);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.router.navigate(['/']);
  }
}