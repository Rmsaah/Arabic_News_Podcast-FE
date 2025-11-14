import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
//TODO: import { EpisodeApiService } from '../../services/episode-api.service';
//TODO: import { EpisodePlayerService } from '../../services/episode-player.service';
import { AuthService } from '../../services/auth.service';
import { UserStats } from '../../components/user-stats/user-stats';
import { UserInfo } from '../../components/user-info/user-info';
//TODO: import { WatchHistory } from '../../components/watch-history/watch-history';
import { EditProfileModal } from '../../components/edit-profile-modal/edit-profile-modal';
import { UserProfileDto, EpisodeDto } from '../../models/episode.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserStats,
    UserInfo,
    //TODO: WatchHistory,
    EditProfileModal
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  profile = signal<UserProfileDto | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');
  showEditModal = signal<boolean>(false);

  constructor(
    private userService: UserService,
    //TODO: private episodeApiService: EpisodeApiService,
    //TODO: private episodePlayerService: EpisodePlayerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading.set(true); // ← Make sure this is set!

    console.log('ProfileComponent ngOnInit called!');
    console.log('Current URL:', this.router.url);

    const currentUser = this.authService.getCurrentUser();
    console.log('Current user in profile:', currentUser);

    if (!currentUser) {
      console.warn('No current user, redirecting to home');
      this.router.navigate(['/']);
      return;
    }

    this.loadUserProfile(currentUser.id);
  }

  loadUserProfile(userId: string): void {
    this.loading.set(true);
    this.error.set('');

    this.userService.getUserProfile(userId).subscribe({
      next: (profileData: UserProfileDto) => {
        this.profile.set(profileData);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load user profile:', err);
        this.error.set('فشل تحميل الملف الشخصي. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
      }
    });
  }

  onEditProfile(): void {
    this.showEditModal.set(true);
  }

  onCloseEditModal(): void {
    this.showEditModal.set(false);
  }

  onProfileUpdated(): void {
    // Reload the profile data after successful update
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loadUserProfile(currentUser.id);
    }
  }
/* TODO: user-episode history stuff
  playEpisodeById(episodeId: string): void {
    this.episodeApiService.getEpisodeById(episodeId).subscribe({
      next: (episode: EpisodeDto) => {
        this.episodePlayerService.setCurrentEpisode(episode);
        this.episodePlayerService.play();
      },
      error: (err: any) => {
        console.error('Failed to load episode:', err);
      }
    });
  }
*/
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
