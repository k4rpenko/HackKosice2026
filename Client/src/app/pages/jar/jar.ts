import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jar.html',
  styleUrls: ['./jar.scss']
})
export class JarComponent {
  jarTitle: string = "Pizza Night";
  totalGoal: number = 620;

  participants = [
    { name: 'John (You)', amountToPay: 155, status: 'paid', avatar: 'JD' },
    { name: 'Maria Petrova', amountToPay: 155, status: 'pending', avatar: 'MP' },
    { name: 'Oleg S.', amountToPay: 155, status: 'pending', avatar: 'OS' },
    { name: 'Anna K.', amountToPay: 155, status: 'pending', avatar: 'AK' }
  ];

  get currentCollected(): number {
    return this.participants
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amountToPay, 0);
  }

  get progressPercentage(): number {
    return (this.currentCollected / this.totalGoal) * 100;
  }

  confirmPayment(index: number) {
    this.participants[index].status = 'paid';
  }

  addParticipant() {
    const name = prompt("Enter participant name:");
    if (name) {
      this.participants.push({
        name: name,
        amountToPay: 155, 
        status: 'pending',
        avatar: name.substring(0, 2).toUpperCase()
      });
    }
  }
}