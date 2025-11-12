import { User } from "../user/types";

export interface Comment {
  id: number | string;
  postId: number | string;
  userId: number | string;
  parentId?: number | string | null;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentWithUser extends Comment {
  user: User;
  replies?: CommentWithUser[];
}

export interface CreateCommentData {
  postId: number | string;
  content: string;
  parentId?: number | string | null; 
}
