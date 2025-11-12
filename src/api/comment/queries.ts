import { useQuery } from '@tanstack/react-query';
import { CommentWithUser, Comment } from './types';
import { User } from '../user/types';
import apiClient from '@/lib/api-client';

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

export const useComments = (postId: string | number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId,
  });
};