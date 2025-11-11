import apiClient from '@/lib/api-client';
import { Comment, CommentWithUser, CreateCommentData } from '@/types/comment';
import { User } from '@/types/auth';

export const getCommentsByPostId = async (
  postId: string | number
): Promise<CommentWithUser[]> => {
  try {
    const [commentsResponse, usersResponse] = await Promise.all([
      apiClient.get<Comment[]>(`/comments?postId=${postId}`),
      apiClient.get<User[]>('/users'),
    ]);

    const comments = commentsResponse.data;
    const users = usersResponse.data;

    // Map comments with user data
    const commentsWithUsers: CommentWithUser[] = comments.map((comment) => {
      const user = users.find((u) => u.id.toString() === comment.userId.toString());

      return {
        ...comment,
        user: user || {
          id: comment.userId,
          email: '',
          name: 'Unknown User',
          createdAt: new Date().toISOString(),
        },
        replies: [],
      };
    });

    // Recursive function to build nested structure
    const buildNestedComments = (parentId: string | number | null): CommentWithUser[] => {
      const childComments = commentsWithUsers
        .filter((c) => {
          if (parentId === null) {
            return !c.parentId || c.parentId === null;
          }
          return c.parentId?.toString() === parentId.toString();
        })
        .map((comment) => ({
          ...comment,
          replies: buildNestedComments(comment.id),
        }));

      // Sort child comments: oldest first for replies
      return childComments.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    };

    // Get all parent comments (no parentId) and build their nested structure
    const parentComments = buildNestedComments(null);

    // Sort parent comments: newest first
    return parentComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
      parentId: data.parentId || null,
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

export const updateComment = async (
  id: string | number,
  content: string
): Promise<Comment> => {
  try {
    const response = await apiClient.patch<Comment>(`/comments/${id}`, {
      content,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update comment');
  }
};
