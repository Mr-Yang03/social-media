import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePostData, UpdatePostData, Post } from './types';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

export const createPost = async (data: CreatePostData): Promise<Post> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Decode token to get user ID
    const decoded = atob(token);
    const userId = decoded.split(':')[0];

    const newPost = {
      userId,
      content: data.content,
      images: data.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await apiClient.post<Post>('/posts', newPost);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create post');
  }
};

export const updatePost = async (
  id: string | number,
  data: UpdatePostData
): Promise<Post> => {
  try {
    const response = await apiClient.patch<Post>(`/posts/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update post');
  }
};

export const deletePost = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/posts/${id}`);
    // Also delete all comments for this post
    const commentsResponse = await apiClient.get(`/comments?postId=${id}`);
    const comments = commentsResponse.data;
    await Promise.all(comments.map((comment: any) => apiClient.delete(`/comments/${comment.id}`)));
  } catch (error) {
    throw new Error('Failed to delete post');
  }
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdatePostData }) =>
      updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update post');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });
};