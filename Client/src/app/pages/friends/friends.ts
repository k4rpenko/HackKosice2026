import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Header } from '../../../components/header/header.component';
import { JarComponent, JarCirclePerson } from '../../../components/jar/jar.component';
import { SearchUserComponent, SearchUserStatusPayload } from '../../../components/search-user/search-user';

interface Person {
  id: number;
  name: string;
  initials: string;
  role: string;
  status?: string;
  category: 'Family' | 'Friends';
  isIndebted?: boolean;
  email?: string;
}

interface SharedTransaction {
  user: string;
  description: string;
  amount: number;
}

interface SharedAccount {
  id: string;
  name: string;
  balance: number;
  members: { name: string; initials: string }[];
  recentTransactions: SharedTransaction[];
  createdAt: Date;
}

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, JarComponent, SearchUserComponent],
  templateUrl: './friends.html',
  styleUrls: ['./friends.scss'],
})
export class FriendsComponent implements OnInit {
  showCreateModal   = signal(false);
  showDeleteConfirm = signal<string | null>(null);
  showAddMemberModal = signal(false);
  showAddPeopleModal = signal(false);

  createForm = {
    accountName:    signal(''),
    initialBalance: signal(''),
    selectedPeople: signal<number[]>([]),
  };
  formError  = signal('');
  isCreating = signal(false);

  newMemberName   = signal('');
  addMemberError  = signal('');
  targetAccountId = signal<string | null>(null);

  sharedAccounts = signal<SharedAccount[]>([
    {
      id: 'acc-1',
      name: 'Family Wallet',
      balance: 3200.5,
      members: [
        { name: 'Maria P.', initials: 'MP' },
        { name: 'You',      initials: 'ME' },
        { name: 'Anna K.',  initials: 'AK' },
      ],
      recentTransactions: [
        { user: 'Maria P.', description: 'Lidl — Groceries',      amount: -45.2  },
        { user: 'You',      description: 'Monthly Deposit',        amount: 500.0  },
        { user: 'Anna K.',  description: 'Netflix Family',         amount: -17.99 },
      ],
      createdAt: new Date('2025-01-15'),
    },
  ]);

  people = signal<Person[]>([
    { id: 1, name: 'Maria Petrova', initials: 'MP', role: 'Sister',      category: 'Family' },
    { id: 3, name: 'Anna K.',       initials: 'AK', role: 'Mother',      category: 'Family' },
    { id: 2, name: 'Oleg Somov',    initials: 'OS', role: 'Friend',      status: 'Owes you €310', category: 'Friends', isIndebted: true },
    { id: 4, name: 'Ivan Bro',      initials: 'IB', role: 'Best Friend', status: 'Settled up',    category: 'Friends' },
  ]);

  familyMembers = computed(() => this.people().filter(p => p.category === 'Family'));
  friends       = computed(() => this.people().filter(p => p.category === 'Friends'));

  jarCirclePeople = computed((): JarCirclePerson[] =>
    this.people().map((p) => ({
      id: p.id,
      name: p.name,
      initials: p.initials,
      role: p.role,
    }))
  );

  ngOnInit(): void {}

  openAddPeopleModal(): void {
    this.showAddPeopleModal.set(true);
  }

  closeAddPeopleModal(): void {
    this.showAddPeopleModal.set(false);
  }

  onSearchUserStatus(ev: SearchUserStatusPayload): void {
    const category: 'Family' | 'Friends' | null =
      ev.status === 'Family' ? 'Family' : ev.status === 'Friend' ? 'Friends' : null;
    const parts = ev.name.trim().split(/\s+/);
    const initials =
      parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : ev.name.slice(0, 2).toUpperCase();

    this.people.update((list) => {
      if (ev.status === 'none') {
        return list.filter((p) => p.email !== ev.email);
      }
      if (!category) {
        return list;
      }
      const existing = list.find((p) => p.email === ev.email);
      if (existing) {
        return list.map((p) => (p.email === ev.email ? { ...p, category } : p));
      }
      const nextId = (list.length ? Math.max(...list.map((x) => x.id)) : 0) + 1;
      return [
        ...list,
        {
          id: nextId,
          name: ev.name,
          initials,
          role: category === 'Family' ? 'Family member' : 'Friend',
          category,
          email: ev.email,
        },
      ];
    });
  }

  openCreateModal(): void {
    this.createForm.accountName.set('');
    this.createForm.initialBalance.set('');
    this.createForm.selectedPeople.set([]);
    this.formError.set('');
    this.showCreateModal.set(true);
  }

  togglePersonSelection(id: number): void {
    const current = this.createForm.selectedPeople();
    this.createForm.selectedPeople.set(
      current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    );
  }

  isPersonSelected(id: number): boolean {
    return this.createForm.selectedPeople().includes(id);
  }

  submitCreateAccount(): void {
    const name    = this.createForm.accountName().trim();
    const balance = parseFloat(this.createForm.initialBalance()) || 0;
    const pIds    = this.createForm.selectedPeople();

    if (!name)          { this.formError.set('Enter an account name'); return; }
    if (!pIds.length)   { this.formError.set('Select at least one member'); return; }

    this.isCreating.set(true);
    this.formError.set('');

    setTimeout(() => {
      const selected = this.people().filter(p => pIds.includes(p.id));
      const newAccount: SharedAccount = {
        id:      'acc-' + Date.now(),
        name,
        balance,
        members: [
          { name: 'You', initials: 'ME' },
          ...selected.map(p => ({ name: p.name, initials: p.initials })),
        ],
        recentTransactions: [],
        createdAt: new Date(),
      };
      this.sharedAccounts.update(list => [...list, newAccount]);
      this.isCreating.set(false);
      this.showCreateModal.set(false);
    }, 900);
  }

  confirmDelete(id: string): void {
    this.showDeleteConfirm.set(id);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  executeDelete(id: string): void {
    this.sharedAccounts.update(list => list.filter(a => a.id !== id));
    this.showDeleteConfirm.set(null);
  }

  getAccountToDelete(): SharedAccount | undefined {
    const id = this.showDeleteConfirm();
    return id ? this.sharedAccounts().find(a => a.id === id) : undefined;
  }

  openAddMember(accountId: string): void {
    this.targetAccountId.set(accountId);
    this.newMemberName.set('');
    this.addMemberError.set('');
    this.showAddMemberModal.set(true);
  }

  submitAddMember(): void {
    const name = this.newMemberName().trim();
    if (!name) { this.addMemberError.set('Enter a name'); return; }

    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const id = this.targetAccountId();

    this.sharedAccounts.update(list =>
      list.map(acc =>
        acc.id === id ? { ...acc, members: [...acc.members, { name, initials }] } : acc
      )
    );
    this.showAddMemberModal.set(false);
  }

  removePerson(id: number): void {
    this.people.update(list => list.filter(p => p.id !== id));
  }

  managePerson(person: Person): void {
    alert(`Manage: ${person.name}`);
  }

  formatAmount(amount: number): string {
    return `${amount >= 0 ? '+' : ''}€${Math.abs(amount).toFixed(2)}`;
  }
}