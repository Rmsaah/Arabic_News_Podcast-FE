import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Search } from '../../components/search/search';
import { Hero } from '../../components/hero/hero';
import { LatestEpisodes } from '../../components/latest-episodes/latest-episodes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Search, Hero, LatestEpisodes],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private router: Router) {}

  onSearch(query: string): void {
    if (query) {
      this.router.navigate(['/episodes'], { queryParams: { search: query } });
    }
  }
}
