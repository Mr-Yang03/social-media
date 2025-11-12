import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCommentData } from './types';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

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

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Comment added!');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Comment deleted!');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string | number; content: string }) =>
      updateComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Comment updated!');
    },
    onError: () => {
      toast.error('Failed to update comment');
    },
  });
};