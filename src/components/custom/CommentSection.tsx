'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/use-comments';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from '@/components/ui/separator';

interface CommentSectionProps {
  postId: string | number;
}

const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(500, 'Comment is too long'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export function CommentSection({ postId }: CommentSectionProps) {
  const { user: currentUser } = useAuth();
  const { data: comments, isLoading } = useComments(postId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const onSubmit = async (data: CommentFormValues) => {
    try {
      await createComment.mutateAsync({
        postId,
        content: data.content,
      });
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async (commentId: string | number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment.mutateAsync(commentId);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Separator />

      {/* Comment Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                      <AvatarFallback>
                        {currentUser ? getInitials(currentUser.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Write a comment..."
                        className="min-h-[60px] resize-none"
                        {...field}
                        disabled={createComment.isPending}
                      />
                      <FormMessage />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={createComment.isPending}
              className="gap-2"
            >
              {createComment.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Comment
            </Button>
          </div>
        </form>
      </Form>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner =
              currentUser?.id.toString() === comment.userId.toString();

            return (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                  <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}
