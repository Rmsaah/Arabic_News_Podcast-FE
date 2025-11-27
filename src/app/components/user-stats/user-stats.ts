import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  /**
   * Format seconds into human-readable time
   * Examples: "5 hours 23 minutes", "45 minutes", "2 hours"
   */
  get formattedListeningTime(): string {
    const seconds = this.totalSecondsListened;

    if (seconds === 0) {
      return '0:00m';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      // Format: "2:45h" (2 hours 45 minutes)
      const paddedMinutes = minutes.toString().padStart(2, '0');
      return `${hours}:${paddedMinutes}h`;
    } else {
      // Format: "0:45m" (45 minutes)
      const paddedMinutes = minutes.toString().padStart(2, '0');
      return `0:${paddedMinutes}m`;
    }
  }
}
