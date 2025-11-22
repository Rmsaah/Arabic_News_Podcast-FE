import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Episode, EpisodeDto, EpisodePageResponse } from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodeApiService {
  private apiUrl = `${environment.apiUrl}/episodes`;

  constructor(private http: HttpClient) { }

  /**
   * Get all episodes with pagination
   * @param page Page number (0-indexed for Spring Boot)
   * @param size Page size
   */
  getEpisodes(page: number = 0, size: number = 10): Observable<EpisodePageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<EpisodePageResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single episode by ID
   * @param id Episode UUID
   */
  getEpisodeById(id: string): Observable<EpisodeDto> {
    return this.http.get<EpisodeDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get daily featured episodes (for home page)
   * Backend endpoint: GET /api/home/daily
   * @param limit Number of episodes to return (default: 5, max: 10)
   */
  getTodayEpisodes(limit: number = 5): Observable<EpisodeDto[]> {
    const params = new HttpParams().set('limit', limit.toString());
    const homeUrl = `${environment.apiUrl}/home`;
    return this.http.get<EpisodeDto[]>(`${homeUrl}/daily`, { params });
  }

  /**
   * Search episodes by title and/or category
   * Backend endpoint: GET /api/episodes/search?title=...&category=...
   * @param title Optional title search term (partial match)
   * @param category Optional category filter (exact match)
   * @param page Page number (0-indexed)
   * @param size Page size
   */
  searchEpisodes(title?: string, category?: string, page: number = 0, size: number = 10): Observable<EpisodePageResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (title) {
      params = params.set('title', title);
    }
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<EpisodePageResponse>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Create a new episode (admin only)
   * Backend endpoint: POST /api/episodes
   * @param episode Episode data
   */
  createEpisode(episode: Episode): Observable<EpisodeDto> {
    return this.http.post<EpisodeDto>(this.apiUrl, episode);
  }
}
