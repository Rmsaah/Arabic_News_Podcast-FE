import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EpisodeDto, EpisodeHistoryDto} from '../../models/episode.model';
import { EpisodePlayerService } from '../../services/episode-player.service';
import { EpisodeApiService } from '../../services/episode-api.service';
import {PlaceholderService} from '../../services/placeholder.service';

@Component({
  selector: 'app-watch-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watch-history.html',
  styleUrl: './watch-history.css'
})
export class WatchHistory implements OnChanges {
  @Input() episodes: EpisodeHistoryDto[] = [];
  @Output() playEpisode = new EventEmitter<string>();

  // Store episode durations to calculate accurate progress
  private episodeDurations = new Map<string, number>();

  constructor(
    public episodePlayerService: EpisodePlayerService,
    private episodeApiService: EpisodeApiService,
    private placeholderService: PlaceholderService
  ) {}

  ngOnChanges(): void {
    // When episodes input changes, fetch durations for accurate progress calculation
    this.episodes.forEach(episode => {
      if (!this.episodeDurations.has(episode.episodeId)) {
        this.fetchEpisodeDuration(episode.episodeId);
      }
    });
  }

  private fetchEpisodeDuration(episodeId: string): void {
    this.episodeApiService.getEpisodeById(episodeId).subscribe({
      next: (episode) => {
        this.episodeDurations.set(episode.id, episode.durationSeconds);
      },
      error: (err) => {
        console.error('Failed to fetch episode duration:', err);
      }
    });
  }

  /**
   * Get accurate completion percentage based on actual episode duration
   * This fixes the issue where backend completionPercentage might be inaccurate
   */
  getAccurateProgressPercentage(episode: EpisodeHistoryDto): number {
    const duration = this.episodeDurations.get(episode.episodeId);

    // If we have the duration, calculate accurately
    if (duration && duration > 0) {
      return Math.min(100, (episode.lastPositionSeconds / duration) * 100);
    }

    // Fallback to backend's calculation
    return episode.completionPercentage;
  }

  onPlayClick(episodeId: string): void {
    this.playEpisode.emit(episodeId);
  }

  /**
   * Get image URL with fallback to placeholder
   */
  getImageUrl(episode: EpisodeDto | null): string {
    if (episode?.imageUrl && episode.imageUrl.trim() !== '') {
      return episode.imageUrl;
    }
    return this.placeholderService.generatePlaceholder();
  }

  /**
   * Handle image loading errors by setting fallback
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderService.generatePlaceholder();
  }
}
