import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  LoginRequestDto,
  LoginResponseDto,
  UserRegistrationRequestDto,
  UserDto
} from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private credentialsKey = 'auth_credentials';

  // Current user state
  private currentUser = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage on init
    this.loadFromStorage();
  }

  /**
   * Register a new user
   * @param request Registration data
   */
  register(request: UserRegistrationRequestDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/register`, request);
  }

  /**
   * Login user with Basic Auth
   * Backend returns: {user: UserDto, credentials: base64, authType: "Basic"}
   * @param request Login credentials
   */
  login(request: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        // Store Base64 credentials for interceptor
        localStorage.setItem(this.credentialsKey, response.credentials);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.next(response.user);
      })
    );
  }

  /**
   * Logout current user - clear stored credentials
   */
  logout(): void {
    localStorage.removeItem(this.credentialsKey);
    localStorage.removeItem('user');
    this.currentUser.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.credentialsKey);
  }

  /**
   * Get current user from memory
   */
  getCurrentUser(): UserDto | null {
    return this.currentUser.value;
  }

  /**
   * Get credentials for interceptor
   */
  getCredentials(): string | null {
    return localStorage.getItem(this.credentialsKey);
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUser.value?.id || null;
  }

  /**
   * Load session from localStorage on init
   */
  private loadFromStorage(): void {
    const credentials = localStorage.getItem(this.credentialsKey);
    const userJson = localStorage.getItem('user');

    if (credentials && userJson) {
      try {
        const user = JSON.parse(userJson) as UserDto;
        this.currentUser.next(user);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.logout();
      }
    }
  }
}
