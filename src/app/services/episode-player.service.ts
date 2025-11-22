import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EpisodeDto } from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodePlayerService {
  // Current playing episode
  private currentEpisode = new BehaviorSubject<EpisodeDto | null>(null);
  public currentEpisode$ = this.currentEpisode.asObservable();

  // Current playback position
  private currentPosition = new BehaviorSubject<number>(0);
  public currentPosition$ = this.currentPosition.asObservable();

  // Is playing state
  private isPlaying = new BehaviorSubject<boolean>(false);
  public isPlaying$ = this.isPlaying.asObservable();

  constructor() { }

  // ============================================
  // Episode Playback Management
  // ============================================

  /**
   * Set the current episode to play
   */
  setCurrentEpisode(episode: EpisodeDto | null): void {
    this.currentEpisode.next(episode);
    // Note: To load saved progress, use ProgressService.getProgress(episodeId)
    // and call setCurrentPosition() with the saved position
  }

  /**
   * Get the current episode
   */
  getCurrentEpisode(): EpisodeDto | null {
    return this.currentEpisode.value;
  }

  /**
   * Play the current episode
   */
  play(): void {
    this.setIsPlaying(true);
  }

  /**
   * Pause the current episode
   */
  pause(): void {
    this.setIsPlaying(false);
  }

  /**
   * Stop playback and clear current episode
   */
  stop(): void {
    this.setIsPlaying(false);
    this.setCurrentEpisode(null);
    this.setCurrentPosition(0);
  }

  /**
   * Seek to a specific position
   * @param position Position in seconds
   */
  seek(position: number): void {
    const episode = this.getCurrentEpisode();
    if (episode) {
      const maxPosition = episode.durationSeconds || 0;
      const clampedPosition = Math.max(0, Math.min(position, maxPosition));
      this.setCurrentPosition(clampedPosition);
    }
  }

  /**
   * Set playback rate
   * @param rate Playback rate (e.g., 1.0, 1.5, 2.0)
   */
  setPlaybackRate(rate: number): void {
    // This will be implemented with actual HTML5 audio element
    console.log('Playback rate:', rate);
  }

  /**
   * Set playback state
   */
  setIsPlaying(playing: boolean): void {
    this.isPlaying.next(playing);
  }

  /**
   * Set current playback position
   */
  setCurrentPosition(position: number): void {
    this.currentPosition.next(position);
  }

  /**
   * Get current playback position
   */
  getCurrentPosition(): number {
    return this.currentPosition.value;
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Format seconds to MM:SS or HH:MM:SS
   */
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Calculate completion percentage
   */
  calculateCompletion(position: number, duration: number): number {
    if (duration === 0) return 0;
    return Math.min((position / duration) * 100, 100);
  }
}
