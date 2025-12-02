import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { EpisodePlayerService } from '../../services/episode-player.service';
import { ProgressService } from '../../services/progress.service';
import { RatingScreen } from '../rating-screen/rating-screen';
import { ExpandedPlayer } from '../expanded-player/expanded-player';
import { EpisodeDto, EpisodeProgressUpdateDto } from '../../models/episode.model';

@Component({
  selector: 'app-playback-controls',
  standalone: true,
  imports: [CommonModule, RatingScreen, ExpandedPlayer],
  templateUrl: './playback-controls.html',
  styleUrl: './playback-controls.css'
})
export class PlaybackControls implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer?: ElementRef<HTMLAudioElement>;

  currentPodcast = signal<EpisodeDto | null>(null);
  isPlaying = signal<boolean>(false);
  currentPosition = signal<number>(0);
  formattedPosition = signal<string>('0:00');
  formattedDuration = signal<string>('0:00');
  isExpanded = signal<boolean>(false);
  showRatingScreen = signal<boolean>(false);
  private subscriptions: Subscription[] = [];
  private lastSavedPosition = 0;
  private progressSaveInterval = 15000; // Save every 15 seconds
  private listeningSessionStart = 0;
  private hasReached10Percent = false; // Track if we've counted this episode as "played" (10% threshold)
  private currentEpisodeId: string | null = null; // Track current episode to reset threshold

  constructor(
    private episodePlayerService: EpisodePlayerService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    // Subscribe to current episode
    this.subscriptions.push(
      this.episodePlayerService.currentEpisode$.subscribe(
        (episode: EpisodeDto | null) => {
          const previousEpisode = this.currentPodcast();

          // Save progress for previous episode before switching
          if (previousEpisode && previousEpisode.id !== episode?.id) {
            this.saveCurrentProgress();
          }

          this.currentPodcast.set(episode);
          if (episode?.durationSeconds) {
            this.formattedDuration.set(this.episodePlayerService.formatTime(episode.durationSeconds));
          }
          // Reset rating screen when new episode starts
          if (episode) {
            // Reset play tracking for new episode OR when same episode loads again (rewatch)
            const isNewEpisode = episode.id !== this.currentEpisodeId;
            this.currentEpisodeId = episode.id;

            if (isNewEpisode) {
              this.hasReached10Percent = false;
              console.log('New episode loaded:', episode.title);
            } else {
              console.log('Same episode reloaded:', episode.title);
            }

            // Validate audio URL
            if (!episode.audioUrlPath) {
              console.error('ERROR: Missing audio URL for episode:', episode.id);
              alert('خطأ: لا يوجد ملف صوتي مرتبط بهذه الحلقة.\n\nالحلقة في قاعدة البيانات غير مرتبطة بملف Audio.\nيرجى التحقق من العلاقة بين Episode و Audio في قاعدة البيانات.');
            }

            this.showRatingScreen.set(false);
            this.lastSavedPosition = 0;
            this.listeningSessionStart = Date.now();
            this.loadSavedProgress(episode.id);
          }
        }
      )
    );

    // Subscribe to playing state
    this.subscriptions.push(
      this.episodePlayerService.isPlaying$.subscribe(
        (playing: boolean) => {
          this.isPlaying.set(playing);
          // Sync audio element with service state
          this.syncAudioPlaybackState(playing);
        }
      )
    );

    // Subscribe to current position
    this.subscriptions.push(
      this.episodePlayerService.currentPosition$.subscribe(
        (position: number) => {
          this.currentPosition.set(position);
          this.formattedPosition.set(this.episodePlayerService.formatTime(position));
          // Note: Episode finish is now handled by onAudioEnded() naturally
        }
      )
    );

    // Periodic progress saving (every 15 seconds during playback)
    this.subscriptions.push(
      interval(this.progressSaveInterval).subscribe(() => {
        if (this.isPlaying()) {
          this.saveCurrentProgress();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    // Audio element is now available - initialization handled by template binding
  }

  ngOnDestroy(): void {
    // Save final progress before destroying component
    this.saveCurrentProgress();

    this.subscriptions.forEach(sub => sub.unsubscribe());
    // Pause audio when component is destroyed
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.pause();
    }
  }

  /**
   * Sync HTML5 audio element with service state
   */
  private syncAudioPlaybackState(shouldPlay: boolean): void {
    if (!this.audioPlayer?.nativeElement) return;

    const audio = this.audioPlayer.nativeElement;

    if (shouldPlay && audio.paused) {
      // Wait for audio to be ready before playing
      if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or better
        audio.play().catch(err => {
          console.error('Failed to play audio:', err);
          this.episodePlayerService.pause();
        });
      }
      // If not ready, will auto-play when loaded (see onAudioLoaded)
    } else if (!shouldPlay && !audio.paused) {
      audio.pause();
    }
  }

  togglePlayPause(): void {
    if (this.isPlaying()) {
      this.episodePlayerService.pause();
    } else {
      this.episodePlayerService.play();
    }
  }

  seek(seconds: number): void {
    if (!this.audioPlayer?.nativeElement) return;

    const audio = this.audioPlayer.nativeElement;
    const newPosition = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration || 0));
    audio.currentTime = newPosition;
    this.episodePlayerService.seek(newPosition);
  }

  seekToPosition(event: MouseEvent): void {
    if (!this.audioPlayer?.nativeElement) return;

    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    // Check if the progress bar is actually rendered as RTL
    const isRTL = getComputedStyle(progressBar).direction === 'rtl';

    // For RTL, invert the calculation
    const percentage = isRTL
      ? (rect.width - clickX) / rect.width  // RTL: right is 0%, left is 100%
      : clickX / rect.width;                 // LTR: left is 0%, right is 100%

    const audio = this.audioPlayer.nativeElement;
    const duration = this.currentPodcast()?.durationSeconds || audio.duration || 0;
    const newPosition = duration * percentage;

    audio.currentTime = newPosition;
    this.episodePlayerService.seek(newPosition);
  }

  setPlaybackRate(rate: number): void {
    if (!this.audioPlayer?.nativeElement) return;

    const audio = this.audioPlayer.nativeElement;
    audio.playbackRate = rate;
    this.episodePlayerService.setPlaybackRate(rate);
  }

  // ============================================
  // HTML5 Audio Event Handlers
  // ============================================

  /**
   * Called continuously as audio plays - updates current position
   */
  onTimeUpdate(): void {
    if (!this.audioPlayer?.nativeElement) return;

    const audio = this.audioPlayer.nativeElement;
    const currentTime = audio.currentTime;

    // Update service with current position
    this.episodePlayerService.setCurrentPosition(currentTime);
  }

  /**
   * Called when audio finishes playing naturally
   */
  onAudioEnded(): void {
    const episode = this.currentPodcast();

    if (!this.audioPlayer?.nativeElement) return;
    const audio = this.audioPlayer.nativeElement;

    // Reset to beginning and pause
    audio.currentTime = 0;
    this.episodePlayerService.setCurrentPosition(0);
    this.episodePlayerService.pause();

    // Mark episode as complete
    if (episode) {
      this.markEpisodeComplete(episode.id, episode.durationSeconds);
    }

    // Show rating screen
    this.onEpisodeFinished();
  }

  /**
   * Called when audio metadata is loaded
   */
  onAudioLoaded(): void {
    if (!this.audioPlayer?.nativeElement) return;

    const audio = this.audioPlayer.nativeElement;
    audio.playbackRate = 1.0;

    // Auto-play if the service says we should be playing
    if (this.isPlaying()) {
      audio.play().catch(err => {
        console.error('Auto-play failed:', err);
        this.episodePlayerService.pause();
      });
    }
  }

  /**
   * Called when audio encounters an error
   */
  onAudioError(event: Event): void {
    const audio = event.target as HTMLAudioElement;
    const episode = this.currentPodcast();

    console.error('Audio playback error:', {
      error: audio.error,
      errorCode: audio.error?.code,
      errorMessage: audio.error?.message,
      audioSrc: audio.src,
      currentSrc: audio.currentSrc,
      episodeAudioUrlPath: episode?.audioUrlPath,
      networkState: audio.networkState,
      readyState: audio.readyState
    });

    // Pause playback on error
    this.episodePlayerService.pause();

    // Show error to user (you can enhance this with a toast notification)
    const errorMessages: { [key: number]: string } = {
      1: 'تم إلغاء تحميل الصوت',
      2: 'خطأ في الشبكة أثناء تحميل الصوت',
      3: 'فشل فك تشفير الصوت',
      4: 'تنسيق الصوت غير مدعوم'
    };

    const errorCode = audio.error?.code || 0;
    const errorMessage = errorMessages[errorCode] || 'حدث خطأ في تشغيل الصوت';

    // Add more context for error code 4
    const debugInfo = errorCode === 4
      ? `\n\nDebug Info:\nURL: ${audio.src}\nEpisode audioUrlPath: ${episode?.audioUrlPath}`
      : '';

    alert(errorMessage + debugInfo);
  }

  // ============================================
  // UI Control Methods
  // ============================================


  close(): void {
    this.episodePlayerService.stop();
    this.isExpanded.set(false);
  }

  toggleExpand(): void {
    this.isExpanded.set(!this.isExpanded());
  }

  collapsePlayer(): void {
    this.isExpanded.set(false);
  }

  onEpisodeFinished(): void {
    const episode = this.currentPodcast();
    if (episode) {
      this.episodePlayerService.pause();
      this.showRatingScreen.set(true);
      this.isExpanded.set(false); // Collapse main player
    }
  }

  onRatingScreenClose(): void {
    this.showRatingScreen.set(false);
  }

  onPlayRelatedEpisode(episode: EpisodeDto): void {
    this.showRatingScreen.set(false);
    this.episodePlayerService.setCurrentEpisode(episode);
    this.episodePlayerService.play();
  }

  // ============================================
  // Progress Tracking Methods
  // ============================================

  /**
   * Load saved progress for an episode and resume from last position
   */
  private loadSavedProgress(episodeId: string): void {
    this.progressService.getProgress(episodeId).subscribe({
      next: (progress) => {
        if (progress) {
          // If episode was completed, start fresh rewatch
          if (progress.isCompleted) {
            console.log('Rewatch - starting from beginning');
            this.hasReached10Percent = false;
            return;
          }

          // Resume from last position
          if (progress.lastPositionSeconds > 0) {
            if (this.audioPlayer?.nativeElement) {
              this.audioPlayer.nativeElement.currentTime = progress.lastPositionSeconds;
              this.episodePlayerService.setCurrentPosition(progress.lastPositionSeconds);
            }
            console.log(`Resumed from ${progress.formattedPosition}`);
            this.hasReached10Percent = true;
          } else {
            this.hasReached10Percent = false;
          }
        }
      },
      error: () => {
        // No saved progress found, start from beginning
        this.hasReached10Percent = false;
      }
    });
  }

  /**
   * Save current playback progress to backend
   * Strategy:
   * - First play (at 10% threshold): Use updateProgress() to increment playCount
   * - Subsequent saves: Use updatePosition() for resume functionality only
   * - Listening time: Tracked separately via trackListeningTime()
   */
  private saveCurrentProgress(): void {
    const episode = this.currentPodcast();
    const position = this.currentPosition();

    if (!episode || position <= 0) return;

    const completionPercentage = (position / episode.durationSeconds) * 100;

    // Only save if position changed significantly (at least 5 seconds)
    if (Math.abs(position - this.lastSavedPosition) < 5) return;

    // CHECK 10% THRESHOLD: First play detection
    if (!this.hasReached10Percent) {
      if (completionPercentage >= 10) {
        console.log(`First play at 10% threshold`);
        this.hasReached10Percent = true;

        // FIRST PLAY: Use updateProgress() to increment playCount
        const update: EpisodeProgressUpdateDto = {
          episodeId: episode.id,
          positionSeconds: Math.floor(position),
          isCompleted: false
        };

        this.progressService.updateProgress(update).subscribe({
          next: () => {
            this.lastSavedPosition = position;
            console.log(`First play recorded: ${Math.floor(position)}s`);
            this.trackListeningSession(episode.id);
          },
          error: (err) => console.error('Failed to save progress:', err)
        });
      } else {
        console.log(`⏸Below 10% threshold - not counting as played yet`);
        return;
      }
    } else {
      // SUBSEQUENT SAVES: Use updatePosition() for resume functionality
      // This does NOT increment playCount, just updates position
      this.progressService.updatePosition(episode.id, Math.floor(position)).subscribe({
        next: () => {
          this.lastSavedPosition = position;
          console.log(`Position saved: ${Math.floor(position)}s`);
          this.trackListeningSession(episode.id);
        },
        error: (err) => console.error('Failed to save position:', err)
      });
    }
  }

  /**
   * Mark episode as complete
   */
  private markEpisodeComplete(episodeId: string, duration: number): void {
    this.progressService.markComplete(episodeId, duration).subscribe({
      next: () => console.log('Episode marked as complete'),
      error: (err) => console.error('Failed to mark episode as complete:', err)
    });
  }

  /**
   * Track listening time for analytics
   * Accumulates total listening time in user profile
   */
  private trackListeningSession(episodeId: string): void {
    const sessionDuration = Math.floor((Date.now() - this.listeningSessionStart) / 1000);

    if (sessionDuration <= 0) return;

    this.progressService.trackListeningTime(episodeId, sessionDuration).subscribe({
      next: () => {
        console.log(`Tracked ${sessionDuration}s listening time`);
        this.listeningSessionStart = Date.now();
      },
      error: (err) => {
        console.error('Failed to track listening time:', err);
        this.listeningSessionStart = Date.now(); // Reset anyway to avoid duplicate tracking
      }
    });
  }
}
