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

}
