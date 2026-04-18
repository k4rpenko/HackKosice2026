import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header.component';

const MAX_CARD_DIGITS = 16;

type CardBrand = 'visa' | 'mastercard';

interface Contact {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  savedCardPan: string;
}

@Component({
  selector: 'app-transfer',
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.scss'],
})
export class TransferComponent {
  readonly maxCardFieldChars = MAX_CARD_DIGITS + 3;

  amount: number | null = null;
  selectedContact: Contact | null = null;
  cardDigits = '';
  cardNumberFormatted = '';

  recentContacts: Contact[] = [
    {
      id: 1,
      name: 'Maria P.',
      initials: 'MP',
      avatarColor: '#2ecc71',
      savedCardPan: '4532015112830366',
    },
    {
      id: 2,
      name: 'Oleg S.',
      initials: 'OS',
      avatarColor: '#a29bfe',
      savedCardPan: '5425233430109903',
    },
  ];

  selectContact(contact: Contact): void {
    this.selectedContact = contact;
    this.applyDigits(contact.savedCardPan.replace(/\D/g, '').slice(0, MAX_CARD_DIGITS));
  }

  onCardFieldInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '').slice(0, MAX_CARD_DIGITS);
    this.applyDigits(digits);
    this.syncCardInputDom(el);
  }

  onCardFieldPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const el = event.target as HTMLInputElement;
    const paste = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, MAX_CARD_DIGITS);
    this.applyDigits(paste);
    this.syncCardInputDom(el);
  }

  onCardFieldKeydown(event: KeyboardEvent): void {
    const navKeys = new Set([
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ]);
    if (navKeys.has(event.key) || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (event.key.length === 1 && /\d/.test(event.key)) {
      const el = event.target as HTMLInputElement;
      const digitsNow = el.value.replace(/\D/g, '');
      const selLen = (el.selectionEnd ?? 0) - (el.selectionStart ?? 0);
      if (selLen === 0 && digitsNow.length >= MAX_CARD_DIGITS) {
        event.preventDefault();
      }
      return;
    }
    event.preventDefault();
  }

  get cardBrand(): CardBrand | null {
    return detectCardBrand(this.cardDigits);
  }

  get cardBrandLabel(): string | null {
    const b = this.cardBrand;
    if (!b) return null;
    return b === 'visa' ? 'VISA' : 'Mastercard';
  }

  confirmTransfer(): void {
    console.log(
      `Sending ${this.amount} to card ${this.cardDigits} (${this.cardBrand ?? 'unknown'})`,
    );
  }

  private applyDigits(digits: string): void {
    this.cardDigits = digits;
    this.cardNumberFormatted = formatPanGroups(digits);
  }

  private syncCardInputDom(el: HTMLInputElement): void {
    const formatted = this.cardNumberFormatted;
    if (el.value !== formatted) {
      el.value = formatted;
    }
  }
}

function formatPanGroups(digits: string): string {
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
}

function detectCardBrand(pan: string): CardBrand | null {
  if (pan.length < 1) return null;
  if (pan[0] === '4') return 'visa';

  const two = parseInt(pan.slice(0, 2), 10);
  if (!Number.isNaN(two) && two >= 51 && two <= 55) return 'mastercard';

  if (pan.length >= 4) {
    const four = parseInt(pan.slice(0, 4), 10);
    if (!Number.isNaN(four) && four >= 2221 && four <= 2720) return 'mastercard';
  }

  return null;
}
