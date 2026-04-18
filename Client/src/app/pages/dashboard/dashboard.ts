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
  userName: string = 'Bob';
  totalBalance: number = 48320;
  isDarkMode: boolean = true;

  transactions = [
    { icon: '🛒', name: 'Lidl — Groceries', meta: 'Today, 14:32 · Revolut', amount: -487, type: 'negative' },
    { icon: '🍕', name: "Domino's — Dinner", meta: 'Yesterday, 20:15 · N26 · Shared', amount: -620, type: 'negative' },
    { icon: '💳', name: 'Transfer from Maria', meta: 'Yesterday, 18:00 · Revolut', amount: 250, type: 'positive' }
  ];

  debts = [
    { name: 'Oleg S.', reason: 'Food, 2 days ago', amount: 310 },
    { name: 'Maria P.', reason: 'Taxi, yesterday', amount: 290 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('light-theme');
  }

  sendPaymentRequests(): void {
    alert('Payment requests sent to all members of the split!');
  }

  remindUser(userName: string): void {
    alert(`Reminder sent to ${userName}!`);
  }

  showAIReport(): void {
    alert('Generating detailed AI Financial Report...');
  }

  addExpense(): void {
    alert('Opening add expense dialog...');
  }
}