import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SearchComponent } from '../../components/search/search';
import { HeroComponent } from '../../components/hero/hero';
//import { LatestEpisodesComponent } from '../../components/latest-episodes/latest-episodes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, HeroComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  onSearch(query: string): void {
    if (query) {
      this.router.navigate(['/episodes'], { queryParams: { search: query } });
    }
  }
}
