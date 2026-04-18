import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  constructor(private router: Router) {} 

  onRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/select-bank']); 
  }
}