import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  isCardsSectionActive(): boolean {
    const path = this.router.url.split('?')[0];
    return path === '/cards' || path.startsWith('/card-details');
  }
}
