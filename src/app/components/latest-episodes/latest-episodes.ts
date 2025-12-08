import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EpisodeApiService } from '../../services/episode-api.service';
import { EpisodePlayerService } from '../../services/episode-player.service';
import { PlaceholderService } from '../../services/placeholder.service';
import { EpisodeDto } from '../../models/episode.model';

@Component({
  selector: 'app-latest-episodes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './latest-episodes.html',
  styleUrl: './latest-episodes.css'
})
export class LatestEpisodes implements OnInit {
  @Input() limit: number = 5; // Default to 5, can be configured to 3-5
  @Input() title: string = 'احدث الحلقات'; // "Today's Episodes"

  episodes: EpisodeDto[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private episodeApiService: EpisodeApiService,
    public episodePlayerService: EpisodePlayerService,
    private placeholderService: PlaceholderService
  ) {}

  ngOnInit(): void {
    this.loadLatestEpisodes();
  }

  loadLatestEpisodes(): void {
    this.loading = true;
    this.episodeApiService.getTodayEpisodes(this.limit).subscribe({
      next: (response: EpisodeDto[]) => {
        this.episodes = response;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading latest episodes:', err);
        this.error = 'فشل تحميل الحلقات. يرجى المحاولة مرة أخرى.';
        this.loading = false;
      }
    });
  }

  playEpisode(episode: EpisodeDto): void {
    this.episodePlayerService.setCurrentEpisode(episode);
    this.episodePlayerService.play();
  }

  /**
   * Get image URL with fallback to placeholder
   */
  getImageUrl(episode: EpisodeDto): string {
    // If episode has an imageUrl, use it
    if (episode.imageUrl && episode.imageUrl.trim() !== '') {
      return episode.imageUrl;
    }

    // Fallback to a default placeholder image
    return this.placeholderService.generatePlaceholder();
  }

  /**
   * Handle image loading errors by setting fallback
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Set fallback image if the original fails to load
    img.src = this.placeholderService.generatePlaceholder();
  }
}
