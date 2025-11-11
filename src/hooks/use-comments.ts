import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as commentApi from '@/apis/comment.api';
import { CreateCommentData } from '@/types/comment';
import { toast } from 'sonner';

export const useComments = (postId: string | number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentApi.getCommentsByPostId(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => commentApi.createComment(data),
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
    mutationFn: (id: string | number) => commentApi.deleteComment(id),
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
