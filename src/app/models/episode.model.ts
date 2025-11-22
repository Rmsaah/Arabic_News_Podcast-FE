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
 * Matches backend: com.shakhbary.arabic_news_podcast.models.Article
 */
export interface Article {
  id: string; // UUID
  author: string;
  publisher: string;
  category: string;
  title: string;
  publicationDate: Date; // Changed from publishedAt
  contentRawUrl: string; // Changed from contentRaw - URL to raw text content
  scriptUrl: string; // Changed from contentCleaned - URL to processed script
  fetchDate: Date; // Changed from fetchedAt
}

/**
 * Audio entity - represents the podcast audio file
 * Matches backend: com.shakhbary.arabic_news_podcast.models.Audio
 */
export interface Audio {
  id: string; // UUID
  articleId: string; // UUID reference - foreign key to Article
  duration: number; // in seconds
  format: string; // e.g., "mp3", "wav"
  urlPath: string; // URL to cloud-stored audio file (NOT NULL in backend)
  creationDate: Date; // Changed from createdAt to match backend
}

/**
 * Episode entity - the main podcast episode
 * Links Article and Audio together
 * Matches backend: com.shakhbary.arabic_news_podcast.models.Episode
 */
export interface Episode {
  id: string; // UUID
  articleId: string; // UUID reference - foreign key to Article (NOT NULL in backend)
  audioId: string; // UUID reference - foreign key to Audio (NOT NULL in backend)
  title: string;
  description?: string;
  scriptUrlPath: string; // Changed from transcript - URL to transcript (NOT NULL in backend)
  imageUrl?: string; // Cover image
  creationDate: Date; // Changed from createdAt to match backend
  // Populated nested objects (from backend DTOs)
  article?: Article;
  audio?: Audio;
}

/**
 * Rating entity - user ratings for episodes
 * Matches backend: com.shakhbary.arabic_news_podcast.models.Rating
 */
export interface Rating {
  id: string; // UUID
  userId: string; // UUID reference - foreign key to User (NOT NULL in backend)
  episodeId: string; // UUID reference - foreign key to Episode (NOT NULL in backend)
  rating: number; // 1-5 stars (NOT NULL in backend)
  ratingDate: Date; // Changed from ratedAt to match backend
}

/**
 * User entity - user account information
 * Matches backend: com.shakhbary.arabic_news_podcast.models.User
 */
export interface User {
  id: string; // UUID
  username: string; // NOT NULL, unique in backend
  email: string; // NOT NULL, unique in backend
  password: string; // Hashed password (NOT NULL in backend, not sent to frontend)
  firstName: string;
  lastName: string;
  secondsListened: number; // Total listening time in seconds (default 0 in backend)
  creationDate: Date; // Changed from createdAt to match backend
  lastLoginDate?: Date; // Changed from lastLoginAt to match backend
  enabled: boolean; // Account enabled status (default true in backend)
  roles?: Role[]; // Many-to-many relationship
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
 * Matches backend: com.shakhbary.arabic_news_podcast.models.EpisodeProgress
 * UNIQUE CONSTRAINT: (user_id, episode_id) - each user can only have one progress record per episode
 */
export interface EpisodeProgress {
  id: string; // UUID
  userId: string; // UUID reference - foreign key to User (NOT NULL in backend)
  episodeId: string; // UUID reference - foreign key to Episode (NOT NULL in backend)
  lastPositionSeconds: number; // Current playback position (NOT NULL in backend)
  isCompleted: boolean; // Whether episode finished (default false in backend)
  playCount: number; // Number of times played (default 1 in backend)
  lastPlayedDate: Date; // Changed from lastPlayedAt to match backend (NOT NULL, auto-set)
  // Calculated fields (not stored in DB - calculated via calculateCompletionPercentage() method)
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
