import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Header } from '../../../components/header/header.component';

export type BankKey = 'tatra' | 'revolut' | 'klarna';

export interface BankMeta {
  key: BankKey;
  label: string;
  shortLabel: string;
}

export interface AvailableBankCard {
  id: number;
  type: string;
  number: string;
  expiry: string;
  cvv: string;
  balance: number;
  isLocked: boolean;
  bankKey: BankKey;
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  templateUrl: './cards.html',
  styleUrls: ['./cards.scss'],
})
export class CardsComponent implements OnInit {
  readonly banks: Record<BankKey, BankMeta> = {
    tatra: { key: 'tatra', label: 'Tatra bank', shortLabel: 'Tatra' },
    revolut: { key: 'revolut', label: 'Revolut', shortLabel: 'Revolut' },
    klarna: { key: 'klarna', label: 'Klarna', shortLabel: 'Klarna' },
  };

  userCards: any[] = [];

  availableBankCards: AvailableBankCard[] = [
    {
      id: 1,
      type: 'Visa Debit',
      number: '4441111122223333',
      expiry: '12/28',
      cvv: '123',
      balance: 5400,
      isLocked: true,
      bankKey: 'tatra' as BankKey,
    },
    {
      id: 2,
      type: 'Mastercard',
      number: '5168111144445555',
      expiry: '05/27',
      cvv: '999',
      balance: 1200,
      isLocked: true,
      bankKey: 'revolut' as BankKey,
    },
    {
      id: 3,
      type: 'Visa',
      number: '4111111111111111',
      expiry: '09/29',
      cvv: '456',
      balance: 890,
      isLocked: true,
      bankKey: 'klarna' as BankKey,
    },
  ];

  showAddModal = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('user_cards');
    if (saved) {
      this.userCards = JSON.parse(saved).map((c: any) => this.normalizeCard(c));
    }
  }

  bankFor(card: any): BankMeta {
    const k = (card.bankKey as BankKey) || 'revolut';
    return this.banks[k] ?? this.banks.revolut;
  }

  openModal(): void {
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
  }

  addCard(card: any): void {
    const exists = this.userCards.find((c) => c.number === card.number);
    if (!exists) {
      this.userCards.push(this.normalizeCard({ ...card }));
      this.saveToStorage();
    }
    this.closeModal();
  }

  toggleView(card: any): void {
    card.isLocked = !card.isLocked;
    this.saveToStorage();
  }

  openCardDetails(card: any): void {
    const lastFour = card.number.slice(-4);
    this.router.navigate(['/card-details', lastFour]);
  }

  /** У списку карт номер завжди з маскою (остання четвірка). */
  formatPanList(number: string): string {
    return `•••• •••• •••• ${number.slice(-4)}`;
  }

  formatCvv(card: any): string {
    return card.isLocked ? '•••' : card.cvv;
  }

  private normalizeCard(c: any): any {
    if (!c.bankKey || !this.banks[c.bankKey as BankKey]) {
      c.bankKey = 'revolut';
    }
    if (c.isLocked === undefined) c.isLocked = true;
    return c;
  }

  private saveToStorage(): void {
    localStorage.setItem('user_cards', JSON.stringify(this.userCards));
  }
}
