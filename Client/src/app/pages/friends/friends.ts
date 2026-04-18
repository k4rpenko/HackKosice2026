import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Person {
  id: number;
  name: string;
  initials: string;
  role: string;
  status?: string;
  category: 'Family' | 'Friends';
  isIndebted?: boolean;
}

interface SharedTransaction {
  user: string;
  description: string;
  amount: number;
}

interface SharedAccount {
  balance: number;
  members: { name: string; initials: string }[];
  recentTransactions: SharedTransaction[];
}

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friends.html',
  styleUrls: ['./friends.scss']
})
export class FriendsComponent implements OnInit {
  
  sharedAccount: SharedAccount | null = {
    balance: 3200.50,
    members: [
      { name: 'Maria P.', initials: 'MP' },
      { name: 'John (You)', initials: 'JD' },
      { name: 'Anna K.', initials: 'AK' }
    ],
    recentTransactions: [
      { user: 'Maria P.', description: 'Lidl - Groceries', amount: -45.20 },
      { user: 'John', description: 'Monthly Deposit', amount: 500.00 },
      { user: 'Anna K.', description: 'Netflix Family', amount: -17.99 }
    ]
  };

  people: Person[] = [
    { id: 1, name: 'Maria Petrova', initials: 'MP', role: 'Sister', category: 'Family' },
    { id: 2, name: 'Oleg Somov', initials: 'OS', role: 'Friend', status: 'Owes you €310', category: 'Friends', isIndebted: true },
    { id: 3, name: 'Anna K.', initials: 'AK', role: 'Mother', category: 'Family' },
    { id: 4, name: 'Ivan Bro', initials: 'IB', role: 'Best Friend', status: 'Settled up', category: 'Friends' }
  ];

  constructor() {}

  ngOnInit(): void {}

  createSharedAccount(): void {
    alert('Initiating Shared Account Wizard...');
  }

  removePerson(id: number): void {
    this.people = this.people.filter(p => p.id !== id);
  }

  managePerson(person: Person): void {
    alert(`Managing settings for ${person.name}`);
  }

  get familyMembers() {
    return this.people.filter(p => p.category === 'Family');
  }

  get friends() {
    return this.people.filter(p => p.category === 'Friends');
  }
}