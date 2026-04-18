import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-bank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-bank.html',
  styleUrls: ['./select-bank.scss']
})
export class SelectBankComponent {
  selectedBank: string | null = null;

  constructor(private router: Router) {}

  select(bank: string) {
    this.selectedBank = bank;
  }

  onContinue() {
    if (this.selectedBank) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSkip() {
    this.router.navigate(['/dashboard']);
  }
}