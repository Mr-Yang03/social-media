import { User } from './auth';

export interface Comment {
  id: number | string;
  postId: number | string;
  userId: number | string;
  content: string;
  createdAt: string;
}

export interface CommentWithUser extends Comment {
  user: User;
}

export interface CreateCommentData {
  postId: number | string;
  content: string;
}
