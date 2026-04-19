import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchUserStatusPayload {
  userId: number;
  name: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-user.html',
  styleUrls: ['./search-user.scss']
})
export class SearchUserComponent {
  @Output() statusChanged = new EventEmitter<SearchUserStatusPayload>();

  searchEmail: string = '';
  foundUser: any = null;
  searchPerformed: boolean = false;

  private mockUsers = [
    { id: 1, name: 'Alexandr petrenko', email: 'alex@gmail.com', status: 'none', avatar: 'A' },
    { id: 2, name: 'Maria Kovalchuk', email: 'maria@gmail.com', status: 'Family', avatar: 'M' },
    { id: 3, name: 'Dmitro Sidoruk', email: 'dima@gmail.com', status: 'Friend', avatar: 'D' },
    { id: 4, name: 'Anna support', email: 'support@bank.com', status: 'none', avatar: 'A' }
  ];

  onSearch() {
    if (!this.searchEmail.trim()) return;
    
    this.searchPerformed = true;
    const user = this.mockUsers.find(u => u.email.toLowerCase() === this.searchEmail.toLowerCase());
    
    if (user) {
      this.foundUser = { ...user };
    } else {
      this.foundUser = null;
    }
  }

  updateStatus(newStatus: string) {
    if (this.foundUser) {
      this.foundUser.status = newStatus;

      const index = this.mockUsers.findIndex(u => u.id === this.foundUser.id);
      if (index !== -1) {
        this.mockUsers[index].status = newStatus;
      }

      this.statusChanged.emit({
        userId: this.foundUser.id,
        name: this.foundUser.name,
        email: this.foundUser.email,
        status: newStatus,
      });
    }
  }
}