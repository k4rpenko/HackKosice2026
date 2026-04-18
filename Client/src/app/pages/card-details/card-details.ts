import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss']
})
export class CardDetailsComponent implements OnInit {
  cardId: string | null = null;
  cardData: any = null;

  transactions: any[] = [
    { type: 'outcome', merchant: 'Spotify Premium', category: 'Subscriptions', date: 'May 12, 10:30 AM', amount: -11.99 },
    { type: 'income', merchant: 'Salary Payment', category: 'Job', date: 'May 10, 09:00 AM', amount: 2500.00 },
    { type: 'outcome', merchant: 'Bolt Trip', category: 'Transport', date: 'May 09, 18:45 PM', amount: -7.50 },
    { type: 'outcome', merchant: 'Starbucks Coffee', category: 'Food & Drink', date: 'May 09, 08:15 AM', amount: -4.20 }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cardId = this.route.snapshot.paramMap.get('id');

    const savedCards = localStorage.getItem('user_cards');
    if (savedCards && this.cardId) {
      const cards = JSON.parse(savedCards);
      this.cardData = cards.find((c: any) => c.number.slice(-4) === this.cardId);
    }
  }
}