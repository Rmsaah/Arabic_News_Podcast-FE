// ============================================
// TypeScript Model Definitions
// ============================================
// This file contains all frontend TypeScript models that match
// the backend DTOs from: com.shakhbary.arabic_news_podcast.dtos
//
// Backend Repository: https://github.com/Rmsaah/Arabic_News_Podcast-BE
//
// IMPORTANT: Keep these models in sync with backend DTOs
// - Field names must match exactly (e.g., imageUrl not imgUrl)
// - Data types must be compatible (UUID -> string, OffsetDateTime -> string)
// ============================================

// ============================================
// Type Aliases
// ============================================

/**
 * UUID type alias - backend uses java.util.UUID which is a string in JSON
 */
export type UUID = string;

// ============================================
// Core Entity Models (matching backend)
// ============================================

/**
 * Article entity - represents the news article/transcript
 */
export interface Article {
  id: string; // UUID
  author: string;
  publisher: string;
  category: string;
  title: string;
  publishedAt: Date;
  contentRaw: string;
  contentCleaned: string;
  urlPath: string; // URL to cloud-stored content
  fetchedAt: Date;
}

/**
 * Audio entity - represents the podcast audio file
 */
export interface Audio {
  id: string; // UUID
  articleId: string; // UUID reference
  duration: number; // in seconds
  format: string; // e.g., "mp3", "wav"
  urlPath: string; // URL to cloud-stored audio
  createdAt: Date;
}

/**
 * Episode entity - the main podcast episode
 * Links Article and Audio together
 */
export interface Episode {
  id: string; // UUID
  articleId: string; // UUID reference
  audioId: string; // UUID reference
  title: string;
  description?: string;
  transcript: string; // URL to transcript
  imageUrl?: string; // Cover image
  createdAt: Date;
  // Populated nested objects (from backend DTOs)
  article?: Article;
  audio?: Audio;
}

/**
 * Rating entity - user ratings for episodes
 */
export interface Rating {
  id: string; // UUID
  userId: string; // UUID reference
  episodeId: string; // UUID reference
  rating: number; // 1-5 stars
  ratedAt: Date;
}

/**
 * User entity - user account information
 */
export interface User {
  id: string; // UUID
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  secondsListened: number;
  createdAt: Date;
  lastLoginAt?: Date;
  enabled: boolean;
  roles?: Role[];
}

/**
 * Role entity - user roles (USER, ADMIN)
 */
export interface Role {
  id: string; // UUID
  name: string; // e.g., "ROLE_USER", "ROLE_ADMIN"
}

/**
 * EpisodeProgress entity - tracks user's progress through episodes
 */
export interface EpisodeProgress {
  id: string; // UUID
  userId: string; // UUID reference
  episodeId: string; // UUID reference
  lastPositionSeconds: number; // Current playback position
  isCompleted: boolean;
  playCount: number;
  lastPlayedAt: Date;
  // Calculated fields (not stored in DB)
  completionPercentage?: number;
  remainingSeconds?: number;
  formattedPosition?: string;
  formattedRemaining?: string;
}

// ============================================
// DTOs (Data Transfer Objects from Backend)
// ============================================

/**
 * Episode DTO - used in API responses
 * Matches backend: com.shakhbary.arabic_news_podcast.dtos.EpisodeDto
 */
export interface EpisodeDto {
  id: string; // UUID
  title: string;
  description?: string;
  scriptUrlPath: string; // URL to transcript (renamed from transcriptUrlPath)
  audioUrlPath: string; // URL to audio file
  durationSeconds: number; // Duration in seconds
  averageRating: number;
  ratingCount: number;
  creationDate: string; // ISO date string (renamed from createdAt)
  articleId: string;
  articleTitle: string;
  imageUrl?: string; // Episode cover image (renamed from imgUrl)
}

/**
 * User DTO - safe user data for frontend
 * Matches backend: com.shakhbary.arabic_news_podcast.dtos.UserDto
 */
export interface UserDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  creationDate: string; // ISO date string
  lastLoginDate?: string; // ISO date string
}

/**
 * Episode Progress DTO
 */
export interface EpisodeProgressDto {
  id: string;
  episodeId: string;
  episodeTitle: string;
  lastPositionSeconds: number;
  completionPercentage: number;
  isCompleted: boolean;
  playCount: number;
  lastPlayedDate: string; // ISO date string
  remainingSeconds: number;
  formattedPosition: string;
  formattedRemaining: string;
}

/**
 * Rating Response DTO
 */
export interface RatingResponseDto {
  ratingId: string;
  userId: string;
  episodeId: string;
  rating: number;
  message: string;
}

/**
 * User Profile DTO - for user profile page
 * Matches backend: com.shakhbary.arabic_news_podcast.dtos.UserProfileDto
 */
export interface UserProfileDto {
  // User info
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  creationDate: string; // ISO date string

  // Stats
  totalEpisodesCompleted: number;
  totalSecondsListened: number;

  // Recent ratings (limit 10)
  recentRatings: UserRatingDto[];

  // Episode history (completed and in-progress, limit 20)
  episodeHistory: EpisodeHistoryDto[];
}

/**
 * User Rating DTO - nested within UserProfileDto
 * Matches backend: UserProfileDto.UserRatingDto
 */
export interface UserRatingDto {
  episodeId: string;
  episodeTitle: string;
  rating: number;
  ratingDate: string; // ISO date string (renamed from ratedAt)
}

/**
 * User Listening Statistics
 */
export interface UserListeningStatsDto {
  userId: string;
  totalListeningSeconds: number;
  completedEpisodes: number;
  inProgressEpisodes: number;
  averageCompletionRate: number;
  formattedTotalTime: string; // e.g., "5h 23m"
}

/**
 * Episode History DTO - for listening history
 * Matches backend: com.shakhbary.arabic_news_podcast.dtos.EpisodeHistoryDto
 */
export interface EpisodeHistoryDto {
  episodeId: string;
  episodeTitle: string;
  episodeImageUrl: string;
  lastPositionSeconds: number;
  completionPercentage: number;
  isCompleted: boolean;
  playCount: number;
  lastPlayedDate: string; // ISO date string (renamed from lastPlayedAt)
  ratingStatus: string; // "Not Rated" or "1 star", etc.
  ratingValue: number | null; // 1-5 if rated, null if not
  ratingDate: string | null; // ISO date string (renamed from ratedAt)
}

// ============================================
// Request DTOs (for API calls)
// ============================================

/**
 * Rating Request - submit a rating
 * NOTE: userId is NOT sent - backend extracts from authentication
 */
export interface RatingRequestDto {
  episodeId: string;
  rating: number; // 1-5
}

/**
 * Episode Progress Update - update playback position
 */
export interface EpisodeProgressUpdateDto {
  episodeId: string;
  positionSeconds: number;
  isCompleted?: boolean;
}

/**
 * User Registration Request
 */
export interface UserRegistrationRequestDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Login Request
 */
export interface LoginRequestDto {
  username: string;
  password: string;
}

/**
 * Login Response - matches backend LoginResponseDto
 * Backend returns Basic Auth credentials, not JWT token
 */
export interface LoginResponseDto {
  user: UserDto;
  credentials: string; // Base64-encoded "username:password" for Basic Auth
  authType: string;    // Always "Basic"
}

// ============================================
// Response Wrappers
// ============================================

/**
 * Paginated Episode Response
 * Matches Spring Boot's Page interface
 */
export interface EpisodePageResponse {
  content: EpisodeDto[];
  totalElements: number;
  totalPages: number;
  number: number; // Current page number (0-indexed) - Spring Boot uses 'number', not 'currentPage'
  size: number; // Page size - Spring Boot uses 'size', not 'pageSize'
}

/**
 * Automation Response (for admin)
 */
export interface AutomationResponse {
  message: string;
  episodes: EpisodeDto[];
}
