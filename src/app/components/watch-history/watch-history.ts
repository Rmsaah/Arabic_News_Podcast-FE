import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodeHistoryDto } from '../../models/episode.model';
//import { EpisodePlayerService } from '../../services/episode-player.service';

@Component({
  selector: 'app-watch-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watch-history.html',
  styleUrl: './watch-history.css'
})
export class WatchHistory {
  @Input() episodes: EpisodeHistoryDto[] = [];
  @Output() playEpisode = new EventEmitter<string>();

  //constructor(public episodePlayerService: EpisodePlayerService) {}

  onPlayClick(episodeId: string): void {
    this.playEpisode.emit(episodeId);
  }
}
