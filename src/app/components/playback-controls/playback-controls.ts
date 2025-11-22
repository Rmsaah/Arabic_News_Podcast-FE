import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { EpisodePlayerService } from '../../services/episode-player.service';
import { ProgressService } from '../../services/progress.service';
// TODO: import { RatingScreenComponent } from '../rating-screen/rating-screen.component';
import { EpisodeDto, EpisodeProgressUpdateDto } from '../../models/episode.model';

@Component({
  selector: 'app-playback-controls',
  standalone: true,
  imports: [CommonModule],
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
              // Completely new episode
              this.hasReached10Percent = false;
              console.log('🆕 New episode loaded');
            } else {
              // Same episode loaded again - could be rewatch or reload
              // Don't reset hasReached10Percent yet, loadSavedProgress will determine
              console.log('🔄 Same episode reloaded');
            }
            // Debug: Log the COMPLETE episode object
            console.log('=== EPISODE SET ===');
            console.log('Full episode object:', episode);
            console.log('Episode details:', {
              id: episode.id,
              title: episode.title,
              audioUrlPath: episode.audioUrlPath,
              audioUrlPathType: typeof episode.audioUrlPath,
              audioUrlPathIsEmpty: !episode.audioUrlPath || episode.audioUrlPath.trim() === '',
              audioUrlPathLength: episode.audioUrlPath?.length,
              allKeys: Object.keys(episode)
            });

            // ERROR: audioUrlPath is null!
            if (!episode.audioUrlPath) {
              console.error('❌ ERROR: audioUrlPath is NULL or EMPTY!');
              alert('خطأ: لا يوجد ملف صوتي مرتبط بهذه الحلقة.\n\nالحلقة في قاعدة البيانات غير مرتبطة بملف Audio.\nيرجى التحقق من العلاقة بين Episode و Audio في قاعدة البيانات.');
            }
            console.log('==================');

            this.showRatingScreen.set(false);
            this.lastSavedPosition = 0;
            this.listeningSessionStart = Date.now();
            // Load saved progress and resume from last position
            this.loadSavedProgress(episode.id);
          } else {
            console.log('=== EPISODE IS NULL ===');
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
    // Audio element is now available
    if (this.audioPlayer?.nativeElement) {
      const audio = this.audioPlayer.nativeElement;
      console.log('=== AUDIO PLAYER INITIALIZED ===');
      console.log('Audio element src:', audio.src);
      console.log('Audio element currentSrc:', audio.currentSrc);
      console.log('currentPodcast():', this.currentPodcast());
      console.log('================================');
    } else {
      console.log('Audio player NOT initialized - element not found');
    }
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
    if (!this.audioPlayer?.nativeElement) {
      console.warn('Cannot sync playback - audio element not available');
      return;
    }

    const audio = this.audioPlayer.nativeElement;

    console.log('=== SYNC PLAYBACK STATE ===');
    console.log('Should play:', shouldPlay);
    console.log('Audio src:', audio.src);
    console.log('Audio paused:', audio.paused);
    console.log('Audio readyState:', audio.readyState);
    console.log('Audio networkState:', audio.networkState);
    console.log('===========================');

    if (shouldPlay && audio.paused) {
      // Wait for audio to be ready before playing
      if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or better
        audio.play().catch(err => {
          console.error('Failed to play audio:', err);
          this.episodePlayerService.pause();
        });
      } else {
        // Audio not ready yet, will auto-play when loaded (see onAudioLoaded)
        console.log('Audio not ready yet, waiting for loadedmetadata event');
      }
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
    const percentage = clickX / rect.width;

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
    console.log('Audio playback ended naturally');
    const episode = this.currentPodcast();

    if (!this.audioPlayer?.nativeElement) return;
    const audio = this.audioPlayer.nativeElement;

    // Reset to beginning and pause (don't stop - keep episode loaded)
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
    console.log('Audio loaded. Duration:', audio.duration);

    // Set initial playback rate
    audio.playbackRate = 1.0;

    // Auto-play if the service says we should be playing
    // This fixes the bug where UI shows playing but audio doesn't play
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
          // Episode has existing progress record
          console.log(`Found existing progress: ${progress.completionPercentage.toFixed(1)}%, playCount: ${progress.playCount}, isCompleted: ${progress.isCompleted}`);

          // If episode was completed but user is playing again, it's a rewatch
          // Reset to beginning and allow fresh playCount increment
          if (progress.isCompleted) {
            console.log('🔄 Episode was completed - starting fresh rewatch');
            this.hasReached10Percent = false;
            // Start from beginning for rewatch
            return;
          }

          // Episode has progress but not completed - resume from last position
          if (progress.lastPositionSeconds > 0) {
            if (this.audioPlayer?.nativeElement) {
              this.audioPlayer.nativeElement.currentTime = progress.lastPositionSeconds;
              this.episodePlayerService.setCurrentPosition(progress.lastPositionSeconds);
            }
            console.log(`▶️  Resumed from ${progress.formattedPosition}`);

            // Since progress record exists, backend already has this episode tracked
            // Set hasReached10Percent to true so progress saves work normally
            // (backend won't increment playCount again for same session)
            this.hasReached10Percent = true;
          } else {
            // Progress record exists but at position 0 - could be a rewatch
            console.log('🔄 Progress at 0 - treating as new play session');
            this.hasReached10Percent = false;
          }
        }
      },
      error: (err) => {
        // No saved progress found, start from beginning (first time playing)
        console.log('🆕 No saved progress - first time playing this episode', err);
        this.hasReached10Percent = false;
      }
    });
  }

  /**
   * Save current playback progress to backend
   * IMPORTANT: Backend increments playCount when progress is first saved.
   * We only save progress after user reaches 10% to ensure accurate playCount.
   */
  private saveCurrentProgress(): void {
    const episode = this.currentPodcast();
    const position = this.currentPosition();

    if (!episode || position <= 0) return;

    // Calculate completion percentage
    const completionPercentage = (position / episode.durationSeconds) * 100;

    // CHECK 10% THRESHOLD: Only update backend after user watches 10%
    // This ensures playCount only increments when episode is genuinely "played"
    // Note: hasReached10Percent may already be true if resuming from saved progress
    if (!this.hasReached10Percent) {
      if (completionPercentage >= 10) {
        console.log(`🎯 Reached 10% threshold (${completionPercentage.toFixed(1)}%) - counting as played`);
        this.hasReached10Percent = true;
        // Continue to save progress below
      } else {
        // User hasn't reached 10% yet, don't save to backend
        console.log(`⏸️  Below 10% (${completionPercentage.toFixed(1)}%) - waiting to count as played`);
        return;
      }
    }

    // Only save if position changed significantly (at least 5 seconds)
    if (Math.abs(position - this.lastSavedPosition) < 5) return;

    const update: EpisodeProgressUpdateDto = {
      episodeId: episode.id,
      positionSeconds: Math.floor(position),
      isCompleted: false
    };

    this.progressService.updateProgress(update).subscribe({
      next: () => {
        this.lastSavedPosition = position;
        console.log(`Progress saved: ${Math.floor(position)}s (${completionPercentage.toFixed(1)}%)`);

        // Track listening time (time elapsed since session start)
        const sessionDuration = Math.floor((Date.now() - this.listeningSessionStart) / 1000);
        if (sessionDuration > 0) {
          this.trackListeningSession(episode.id, sessionDuration);
          this.listeningSessionStart = Date.now(); // Reset for next interval
        }
      },
      error: (err) => {
        console.error('Failed to save progress:', err);
      }
    });
  }

  /**
   * Mark episode as complete
   */
  private markEpisodeComplete(episodeId: string, duration: number): void {
    console.log(`📋 Marking episode as complete (episodeId: ${episodeId}, duration: ${duration}s)`);
    this.progressService.markComplete(episodeId, duration).subscribe({
      next: () => {
        console.log('✅ Episode successfully marked as complete in backend');
      },
      error: (err) => {
        console.error('❌ Failed to mark episode as complete:', err);
      }
    });
  }

  /**
   * Track listening time for analytics
   */
  private trackListeningSession(episodeId: string, secondsListened: number): void {
    if (secondsListened <= 0) return;

    this.progressService.trackListeningTime(episodeId, secondsListened).subscribe({
      next: () => {
        console.log(`Tracked ${secondsListened}s of listening time`);
      },
      error: (err) => {
        console.error('Failed to track listening time:', err);
      }
    });
  }
}
