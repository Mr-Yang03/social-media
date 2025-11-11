import { User } from './auth';

export interface Post {
  id: number | string;
  userId: number | string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithUser extends Post {
  user: User;
  commentsCount?: number;
}

export interface CreatePostData {
  content: string;
}

export interface UpdatePostData {
  content: string;
}
