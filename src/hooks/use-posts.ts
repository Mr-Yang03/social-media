import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as postApi from '@/apis/post.api';
import { CreatePostData, UpdatePostData } from '@/types/post';
import { toast } from 'sonner';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: postApi.getPosts,
  });
};

export const usePost = (id: string | number) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postApi.getPostById(id),
    enabled: !!id,
  });
};

export const useUserPosts = (userId: string | number) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => postApi.getPostsByUserId(userId),
    enabled: !!userId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postApi.createPost(data),
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
      postApi.updatePost(id, data),
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
    mutationFn: (id: string | number) => postApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });
};
