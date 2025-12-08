import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodePlayerService } from '../../services/episode-player.service';
import { PlaceholderService} from '../../services/placeholder.service';
import { EpisodeDto } from '../../models/episode.model';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-list.html',
  styleUrl: './episode-list.css'
})
export class EpisodeList {
  @Input() episodes: EpisodeDto[] = [];
  @Input() loading: boolean = false;
  @Input() error: string = '';

  constructor(
    public episodePlayerService: EpisodePlayerService,
    private placeholderService: PlaceholderService
  ) {}

  playEpisode(episode: EpisodeDto): void {
    this.episodePlayerService.setCurrentEpisode(episode);
    this.episodePlayerService.play();
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
