import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { UserDto } from '../../models/episode.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuCollapsed = true;
  isSearchOpen = false;
  searchQuery = '';
  currentUser = signal<UserDto | null>(null);
  isAuthenticated = signal<boolean>(false);
  private subscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private authModalService: AuthModalService
  ) {}

  ngOnInit(): void {
    // Subscribe to current user changes
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchQuery = '';
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/episodes'], { queryParams: { search: this.searchQuery } });
      this.isSearchOpen = false;
      this.searchQuery = '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isMenuCollapsed = true; // Close menu after logout
  }

  openLoginModal(): void {
    this.authModalService.openLogin();
    this.isMenuCollapsed = true; // Close mobile menu
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.isMenuCollapsed = true; // Close menu after navigation
  }
}
