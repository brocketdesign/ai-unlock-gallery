export interface User {
  id: string;
  clerkId: string;
  email: string;
  gems: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  userId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  isUnlocked: boolean;
  unlockGameType: 'scratch' | 'puzzle';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'purchase' | 'earn' | 'spend';
  amount: number;
  description: string;
  stripeSessionId?: string;
  createdAt: Date;
}

export interface GameResult {
  gameType: 'scratch' | 'puzzle';
  completed: boolean;
  timeSpent: number;
}

export interface NovitaImageRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
}

export interface NovitaImageResponse {
  task_id: string;
  status: string;
  image_url?: string;
  error?: string;
}
