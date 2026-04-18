import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Contact {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
}

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.scss']
})
export class TransferComponent {
  amount: number | null = null;
  selectedContact: any = null;
  sourceCard: string = '4441 •••• •••• 5555';

  recentContacts = [
    { id: 1, name: 'Maria P.', initials: 'MP', avatarColor: '#2ecc71' },
    { id: 2, name: 'Oleg S.', initials: 'OS', avatarColor: '#a29bfe' }
  ];

  selectContact(contact: any) { this.selectedContact = contact; }

  confirmTransfer() {
    console.log(`Sending ${this.amount} from card ${this.sourceCard}`);
  }
}