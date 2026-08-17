export type UserRole = 'user' | 'owner' | 'developer';
export type SportType = 'football' | 'basketball' | 'volleyball' | 'tennis' | 'swimming' | 'boxing' | 'badminton';
export type MatchStatus = 'open' | 'full' | 'completed' | 'cancelled';
export type VenueStatus = 'active' | 'pending' | 'inactive';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  phone?: string;
  city: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  createdAt: Date;
  preferredSports: SportType[];
}

export interface Venue {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  images: string[];
  amenities: string[];
  sports: SportType[];
  pricePerHour: number;
  status: VenueStatus;
  rating: number;
  reviewCount: number;
  phone?: string;
  openHours?: string;
}

export interface Match {
  id: string;
  creatorId: string;
  creatorName: string;
  sport: SportType;
  venueId: string;
  venueName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  date: Date;
  maxPlayers: number;
  players: string[];
  playerNames: string[];
  status: MatchStatus;
  pricePerPlayer: number;
  description?: string;
  isPrivate: boolean;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'any';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match_invite' | 'player_joined' | 'match_reminder' | 'match_cancelled' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  streak: number;
}
