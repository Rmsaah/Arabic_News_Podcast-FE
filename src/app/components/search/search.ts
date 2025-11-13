import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<string>();
  searchQuery: string = '';

  onSearch(): void {
    this.searchEvent.emit(this.searchQuery);
  }

  onClear(): void {
    this.searchQuery = '';
    this.searchEvent.emit('');
  }
}
