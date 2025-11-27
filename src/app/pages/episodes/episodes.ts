import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Search } from '../../components/search/search';
import { EpisodeList } from '../../components/episode-list/episode-list';
import { EpisodeApiService } from '../../services/episode-api.service';
import { EpisodeDto } from '../../models/episode.model';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, Search, EpisodeList],
  templateUrl: './episodes.html',
  styleUrl: './episodes.css'
})
export class Episodes implements OnInit {
  episodes = signal<EpisodeDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');
  searchQuery = signal<string>('');
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  pageSize = 12;

  constructor(
    private episodeApiService: EpisodeApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for search query param
    this.route.queryParams.subscribe(params => {
      const search = params['search'];
      if (search) {
        this.searchQuery.set(search);
        this.onSearch(search);
      } else {
        this.loadEpisodes();
      }
    });
  }

  loadEpisodes(page: number = 0): void {
    this.loading.set(true);
    this.error.set('');

    this.episodeApiService.getEpisodes(page, this.pageSize).subscribe({
      next: (response) => {
        // Sort episodes by creation date (newest first)
        const sortedEpisodes = this.sortEpisodesByDate(response.content);
        this.episodes.set(sortedEpisodes);
        this.currentPage.set(response.number); // Spring Boot uses 'number', not 'currentPage'
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load episodes:', err);
        this.error.set('فشل تحميل الحلقات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);

    if (!query || query.trim() === '') {
      this.loadEpisodes();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.episodeApiService.searchEpisodes(query, undefined, 0, this.pageSize).subscribe({
      next: (response) => {
        // Sort search results by creation date (newest first)
        const sortedEpisodes = this.sortEpisodesByDate(response.content);
        this.episodes.set(sortedEpisodes);
        this.currentPage.set(response.number); // Spring Boot uses 'number'
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Search error:', err);
        this.error.set('فشل البحث. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
      }
    });
  }

  loadPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;

    if (this.searchQuery()) {
      this.episodeApiService.searchEpisodes(
        this.searchQuery(),
        undefined,
        page,
        this.pageSize
      ).subscribe({
        next: (response) => {
          // Sort paginated search results by creation date (newest first)
          const sortedEpisodes = this.sortEpisodesByDate(response.content);
          this.episodes.set(sortedEpisodes);
          this.currentPage.set(response.number); // Spring Boot uses 'number'
          this.totalPages.set(response.totalPages);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.error('Failed to load page:', err);
        }
      });
    } else {
      this.loadEpisodes(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Sort episodes by creation date (newest first)
   * @param episodes Array of episodes to sort
   */
  private sortEpisodesByDate(episodes: EpisodeDto[]): EpisodeDto[] {
    return [...episodes].sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime();
      const dateB = new Date(b.creationDate).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }
}
