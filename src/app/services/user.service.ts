import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  UserDto,
  UserProfileDto,
  UserListeningStatsDto,
  EpisodeHistoryDto
} from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  /**
   * Get user by ID
   * @param userId User UUID
   */
  getUserById(userId: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Get complete user profile with stats and history
   * @param userId User UUID
   */
  getUserProfile(userId: string): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.apiUrl}/${userId}/profile`);
  }

  /**
   * Update user's name (first name and/or last name)
   * Backend: PATCH /api/users/{userId}
   * Note: Users can only update their own profile
   * At least one field must be provided
   * @param userId User UUID
   * @param firstName New first name (optional)
   * @param lastName New last name (optional)
   */
  updateUserName(userId: string, firstName?: string, lastName?: string): Observable<UserDto> {
    const updateDto: {firstName?: string, lastName?: string} = {};
    if (firstName) updateDto.firstName = firstName;
    if (lastName) updateDto.lastName = lastName;

    return this.http.patch<UserDto>(`${this.apiUrl}/${userId}`, updateDto);
  }
}

