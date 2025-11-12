import { User } from "../user/types";

export interface Post {
  id: number | string;
  userId: number | string;
  content: string;
  images?: string[]; // Array of base64 image strings
  createdAt: string;
  updatedAt: string;
}

export interface PostWithUser extends Post {
  user: User;
  commentsCount?: number;
}

export interface CreatePostData {
  content: string;
  images?: string[];
}

export interface UpdatePostData {
  content: string;
  images?: string[];
}
