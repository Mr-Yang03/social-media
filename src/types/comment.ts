import { User } from './auth';

export interface Comment {
  id: number | string;
  postId: number | string;
  userId: number | string;
  parentId?: number | string | null; // For nested replies
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentWithUser extends Comment {
  user: User;
  replies?: CommentWithUser[]; // Nested replies
}

export interface CreateCommentData {
  postId: number | string;
  content: string;
  parentId?: number | string | null; // Optional parent comment ID
}
