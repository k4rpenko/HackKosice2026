import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-cards',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cards.html',
    styleUrls: ['./cards.scss']
})
export class CardsComponent implements OnInit {
    userCards: any[] = [];
    availableBankCards: any[] = [
        { id: 1, type: 'Visa Gold', number: '4441111122223333', expiry: '12/28', cvv: '123', balance: 5400, isLocked: true },
        { id: 2, type: 'Mastercard World', number: '5168111144445555', expiry: '05/27', cvv: '999', balance: 1200, isLocked: true }
    ];
    showAddModal: boolean = false;

    constructor(private router: Router) { }

    ngOnInit(): void {
        const saved = localStorage.getItem('user_cards');
        if (saved) {
            this.userCards = JSON.parse(saved);
        }
    }

    openModal() {
        this.showAddModal = true;
    }

    closeModal() {
        this.showAddModal = false;
    }

    addCard(card: any) {
        const exists = this.userCards.find(c => c.number === card.number);
        if (!exists) {
            this.userCards.push({ ...card });
            this.saveToStorage();
        }
        this.closeModal();
    }

    toggleView(card: any) {
        card.isLocked = !card.isLocked;
        this.saveToStorage();
    }

    openCardDetails(card: any) {
        console.log('Details for:', card.number);
        const lastFour = card.number.slice(-4);
        this.router.navigate(['/card-details', lastFour]);
    }

    formatNumber(number: string, isLocked: boolean): string {
        if (isLocked) {
            return `•••• •••• •••• ${number.slice(-4)}`;
        }
        return number.replace(/(.{4})/g, '$1 ').trim();
    }

    private saveToStorage() {
        localStorage.setItem('user_cards', JSON.stringify(this.userCards));
    }
}