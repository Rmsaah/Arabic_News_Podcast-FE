import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.css'
})
export class UserInfo {
  @Input() username: string = '';
  @Input() email: string = '';
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() creationDate: string = '';

  @Output() edit = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  get displayName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username;
  }

  get greeting(): string {
    const name = this.firstName || this.username;
    return `مرحباً، ${name}!`;
  }

  onEditClick(): void {
    this.edit.emit();
  }

  onLogoutClick(): void {
    this.logout.emit();
  }
}
