import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { EpisodePlayerService } from '../../services/episode-player.service';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-stats.html',
  styleUrl: './user-stats.css'
})
export class UserStats {
  @Input() totalEpisodesCompleted: number = 0;
  @Input() totalSecondsListened: number = 0;
  @Input() totalRatings: number = 0;
  @Input() totalHistory: number = 0;

  //constructor(public episodePlayerService: EpisodePlayerService) {}

  /**
   * Format seconds into human-readable time
   * Examples: "5 hours 23 minutes", "45 minutes", "2 hours"
   */
  get formattedListeningTime(): string {
    const seconds = this.totalSecondsListened;

    if (seconds === 0) {
      return '0 دقيقة';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
      return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'} و ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    } else {
      return `${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
    }
  }
}
