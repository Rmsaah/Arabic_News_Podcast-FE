import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EpisodeProgressDto,
  EpisodeProgressUpdateDto,
  UserListeningStatsDto
} from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) { }

  // ==========================================
  // Core Progress Tracking
  // ==========================================

  /**
   * Update episode progress (main endpoint)
   * Backend: POST /api/progress
   * Note: Uses authenticated user from Basic Auth
   * @param update Progress update data (episodeId and positionSeconds)
   */
  updateProgress(update: EpisodeProgressUpdateDto): Observable<EpisodeProgressDto> {
    return this.http.post<EpisodeProgressDto>(this.apiUrl, update);
  }

  /**
   * Get progress for a specific episode
   * Backend: GET /api/progress/episodes/{episodeId}
   * Note: Uses authenticated user from Basic Auth
   * @param episodeId Episode UUID
   */
  getProgress(episodeId: string): Observable<EpisodeProgressDto> {
    return this.http.get<EpisodeProgressDto>(`${this.apiUrl}/episodes/${episodeId}`);
  }

  /**
   * Mark episode as complete
   * Backend: POST /api/progress/episodes/{episodeId}/complete
   * Note: Uses authenticated user from Basic Auth
   * @param episodeId Episode UUID
   * @param positionSeconds Final position (typically episode duration)
   */
  markComplete(episodeId: string, positionSeconds: number): Observable<void> {
    const params = new HttpParams().set('positionSeconds', positionSeconds.toString());
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/complete`, null, { params });
  }

  /**
   * Update episode position (for resume functionality)
   * Backend: POST /api/progress/episodes/{episodeId}/position
   * Note: Uses authenticated user from Basic Auth
   * @param episodeId Episode UUID
   * @param positionSeconds Current position in seconds
   */
  updatePosition(episodeId: string, positionSeconds: number): Observable<void> {
    const params = new HttpParams().set('positionSeconds', positionSeconds.toString());
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/position`, null, { params });
  }

  /**
   * Track listening time
   * Backend: POST /api/progress/episodes/{episodeId}/track-listening
   * Note: Uses authenticated user from Basic Auth
   * @param episodeId Episode UUID
   * @param secondsListened Seconds listened in this session
   */
  trackListeningTime(episodeId: string, secondsListened: number): Observable<void> {
    const params = new HttpParams().set('secondsListened', secondsListened.toString());
    return this.http.post<void>(`${this.apiUrl}/episodes/${episodeId}/track-listening`, null, { params });
  }

  /**
   * Get in-progress episodes for user (Continue Listening feature)
   * Backend: GET /api/progress/in-progress
   * Note: Uses authenticated user from Basic Auth
   */
  getInProgressEpisodes(): Observable<EpisodeProgressDto[]> {
    return this.http.get<EpisodeProgressDto[]>(`${this.apiUrl}/in-progress`);
  }

  // ==========================================
  // Statistics
  // ==========================================

  /**
   * Get user's listening statistics
   * Backend: GET /api/progress/stats
   * Note: Uses authenticated user from Basic Auth
   */
  getUserStats(): Observable<UserListeningStatsDto> {
    return this.http.get<UserListeningStatsDto>(`${this.apiUrl}/stats`);
  }
}
