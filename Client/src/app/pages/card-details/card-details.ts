import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../../../components/header/header.component';
import type { BankKey } from '../cards/cards';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss'],
})
export class CardDetailsComponent implements OnInit {
  cardId: string | null = null;
  cardData: any = null;
  /** Hide full PAN / CVV until toggled */
  showSensitive = false;

  readonly banks: Record<
    BankKey,
    { label: string; shortLabel: string }
  > = {
    tatra: { label: 'Tatra bank', shortLabel: 'Tatra' },
    revolut: { label: 'Revolut', shortLabel: 'Revolut' },
    klarna: { label: 'Klarna', shortLabel: 'Klarna' },
  };

  transactions: any[] = [
    { type: 'outcome', merchant: 'Spotify Premium', category: 'Subscriptions', date: 'May 12, 10:30 AM', amount: -11.99 },
    { type: 'income', merchant: 'Salary Payment', category: 'Job', date: 'May 10, 09:00 AM', amount: 2500.0 },
    { type: 'outcome', merchant: 'Bolt Trip', category: 'Transport', date: 'May 09, 18:45 PM', amount: -7.5 },
    { type: 'outcome', merchant: 'Starbucks Coffee', category: 'Food & Drink', date: 'May 09, 08:15 AM', amount: -4.2 },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cardId = this.route.snapshot.paramMap.get('id');

    const savedCards = localStorage.getItem('user_cards');
    if (savedCards && this.cardId) {
      const cards = JSON.parse(savedCards);
      this.cardData = cards.find((c: any) => c.number.slice(-4) === this.cardId);
      if (this.cardData && !this.cardData.bankKey) {
        this.cardData.bankKey = 'revolut';
      }
    }
  }

  bankKey(): BankKey {
    const k = this.cardData?.bankKey as BankKey;
    return k && this.banks[k] ? k : 'revolut';
  }

  bankLabel(): string {
    return this.banks[this.bankKey()].label;
  }

  bankShort(): string {
    return this.banks[this.bankKey()].shortLabel;
  }

  formatPan(): string {
    if (!this.cardData?.number) return '•••• •••• •••• ••••';
    const n = this.cardData.number as string;
    if (!this.showSensitive) {
      return `•••• •••• •••• ${n.slice(-4)}`;
    }
    return n.replace(/(.{4})/g, '$1 ').trim();
  }

  formatCvv(): string {
    if (!this.cardData?.cvv) return '•••';
    return this.showSensitive ? this.cardData.cvv : '•••';
  }

  toggleSensitive(): void {
    this.showSensitive = !this.showSensitive;
  }

  get spentThisMonth(): number {
    return this.transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  }

  get incomeThisMonth(): number {
    return this.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  }
}
