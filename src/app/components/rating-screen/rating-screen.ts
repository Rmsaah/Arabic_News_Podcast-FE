import { Component, Input, Output, EventEmitter, signal, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodeApiService } from '../../services/episode-api.service';
import { RatingService } from '../../services/rating.service';
import { EpisodePlayerService } from '../../services/episode-player.service';
import { EpisodeDto, RatingRequestDto } from '../../models/episode.model';

@Component({
  selector: 'app-rating-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-screen.html',
  styleUrl: './rating-screen.css'
})
export class RatingScreen implements OnInit, OnChanges {
  @Input() episode: EpisodeDto | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() playEpisode = new EventEmitter<EpisodeDto>();

  userRating = signal<number>(0);
  hoverRating = signal<number>(0);
  relatedEpisodes = signal<EpisodeDto[]>([]);
  ratingSubmitted = signal<boolean>(false);

  constructor(
    private episodeApiService: EpisodeApiService,
    private ratingService: RatingService,
    public episodePlayerService: EpisodePlayerService
  ) {}

  ngOnInit(): void {
    if (this.episode) {
      // Note: Backend doesn't have getUserRating endpoint
      // User's ratings are only available through UserProfileDto.recentRatings or episodeHistory
      // For now, we'll start with userRating = 0 and let them rate
      this.loadRelatedEpisodes(this.episode);
    }
  }

  ngOnChanges(): void {
    // Reset state when episode changes
    if (this.episode && this.visible) {
      this.userRating.set(0);
      this.ratingSubmitted.set(false);
      // Note: Cannot load user's existing rating without fetching full user profile
      // This is acceptable - user can simply re-rate to update their rating
      this.loadRelatedEpisodes(this.episode);
    }
  }

  loadRelatedEpisodes(currentEpisode: EpisodeDto): void {
    // Load recent episodes as "Listen Next" recommendations
    this.episodeApiService.getTodayEpisodes(6).subscribe({
      next: (episodes: EpisodeDto[]) => {
        // Filter out current episode
        const related = episodes.filter((ep: EpisodeDto) => ep.id !== currentEpisode.id).slice(0, 5);
        this.relatedEpisodes.set(related);
      },
      error: (err: any) => {
        console.error('Failed to load related episodes:', err);
        this.relatedEpisodes.set([]);
      }
    });
  }

  setRating(rating: number): void {
    if (!this.episode) return;

    this.userRating.set(rating);

    const request: RatingRequestDto = {
      episodeId: this.episode.id,
      rating: rating
    };

    this.ratingService.rateEpisode(request).subscribe({
      next: () => {
        this.ratingSubmitted.set(true);
        // Update episode's average rating (optional - could refetch episode)
      },
      error: (err) => {
        console.error('Failed to submit rating:', err);
        alert('فشل إرسال التقييم. يرجى المحاولة مرة أخرى.');
      }
    });
  }

  onStarHover(star: number): void {
    this.hoverRating.set(star);
  }

  onStarLeave(): void {
    this.hoverRating.set(0);
  }

  closeRatingScreen(): void {
    this.close.emit();
  }

  playRelatedEpisode(episode: EpisodeDto): void {
    this.playEpisode.emit(episode);
  }

  /**
   * Get image URL with fallback to placeholder
   */
  getImageUrl(episode: EpisodeDto | null): string {
    if (episode?.imageUrl && episode.imageUrl.trim() !== '') {
      return episode.imageUrl;
    }
    return 'https://via.placeholder.com/400x300/667eea/ffffff?text=Arabic+News+Podcast';
  }

  /**
   * Handle image loading errors by setting fallback
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Arabic+News+Podcast';
  }
}
