/**
 * Represents the public-facing profile data of a user.
 * This aligns with the Profile schema in the NestJS backend.
 */
export interface Profile {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  userId: string; // Ref back to the User document
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the authenticated user's core data.
 * This aligns with the User schema in the NestJS backend and is primarily
 * for authentication and session management. Social data is in the Profile.
 */
export interface User {
  _id: string;
  email: string;
  role: "user" | "moderator" | "admin";
  provider: "google" | "credentials";
  emailVerified: boolean;
  isActive: boolean;
  profile: Profile; // user's profile is a nested object.
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a single post made by a user.
 * This will be the shape of the data for our Post component
 */
export interface Post {
  _id: string;
  author: Profile; // The author's profile is nested
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}