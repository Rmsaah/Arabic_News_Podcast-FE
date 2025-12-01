import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}
