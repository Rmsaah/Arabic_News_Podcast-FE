import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  RatingRequestDto,
  RatingResponseDto
} from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) { }

  /**
   * Submit or update a rating for an episode
   * Backend: POST /api/ratings
   * Note: Backend extracts userId from Basic Auth, only send episodeId and rating
   * Creates new rating if none exists, updates existing rating otherwise
   * @param request Rating request data (episodeId and rating only)
   */
  rateEpisode(request: RatingRequestDto): Observable<RatingResponseDto> {
    return this.http.post<RatingResponseDto>(this.apiUrl, request);
  }

  /**
   * NOTE: The following endpoints are NOT available in the backend:
   * - GET /api/ratings/episode/{episodeId}/user (get user's rating)
   * - GET /api/ratings/episode/{episodeId} (get all ratings for episode)
   * - GET /api/ratings/episode/{episodeId}/average (get average rating)
   * - DELETE /api/ratings/{ratingId} (delete rating)
   *
   * Average ratings and rating counts are included in EpisodeDto.averageRating and EpisodeDto.ratingCount
   * User's rating history is available in UserProfileDto.recentRatings
   */
}
