import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceholderService} from '../../services/placeholder.service';
import { EpisodeDto } from '../../models/episode.model';

@Component({
  selector: 'app-expanded-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expanded-player.html',
  styleUrl: './expanded-player.css'
})
export class ExpandedPlayer {
  @Input() episode!: EpisodeDto;
  @Input() currentPosition: number = 0;
  @Input() formattedPosition: string = '0:00';
  @Input() formattedDuration: string = '0:00';
  @Input() isPlaying: boolean = false;

  @Output() collapse = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() togglePlayPause = new EventEmitter<void>();
  @Output() seek = new EventEmitter<number>();
  @Output() seekToPosition = new EventEmitter<MouseEvent>();
  @Output() setPlaybackRate = new EventEmitter<number>();

  constructor(
    private placeholderService: PlaceholderService
  ) {}

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
