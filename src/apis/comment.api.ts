import apiClient from '@/lib/api-client';
import { Comment, CommentWithUser, CreateCommentData } from '@/types/comment';
import { User } from '@/types/auth';

export const getCommentsByPostId = async (
  postId: string | number
): Promise<CommentWithUser[]> => {
  try {
    const [commentsResponse, usersResponse] = await Promise.all([
      apiClient.get<Comment[]>(`/comments?postId=${postId}&_sort=createdAt`),
      apiClient.get<User[]>('/users'),
    ]);

    const comments = commentsResponse.data;
    const users = usersResponse.data;

    return comments.map((comment) => {
      const user = users.find((u) => u.id.toString() === comment.userId.toString());

      return {
        ...comment,
        user: user || {
          id: comment.userId,
          email: '',
          name: 'Unknown User',
          createdAt: new Date().toISOString(),
        },
      };
    });
  } catch (error) {
    throw new Error('Failed to fetch comments');
  }
};

export const createComment = async (data: CreateCommentData): Promise<Comment> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Decode token to get user ID
    const decoded = atob(token);
    const userId = decoded.split(':')[0];

    const newComment = {
      postId: data.postId,
      userId,
      content: data.content,
      createdAt: new Date().toISOString(),
    };

    const response = await apiClient.post<Comment>('/comments', newComment);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create comment');
  }
};

export const deleteComment = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/comments/${id}`);
  } catch (error) {
    throw new Error('Failed to delete comment');
  }
};
