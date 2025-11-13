'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import MainForm from '@/components/custom/MainForm';
import { Loader2, MessageCircle, Pencil, Send, Trash2 } from 'lucide-react';
import { useCreateComment, useDeleteComment, useUpdateComment } from '@/api/comment/mutations';
import { useComments } from '@/api/comment/queries';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/Separator';
import { CommentWithUser } from '@/api/comment/types';

interface CommentSectionProps {
  postId: string | number;
}

const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(500, 'Comment is too long'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentItemProps {
  comment: CommentWithUser;
  currentUser: any;
  onReply: (commentId: string | number) => void;
  onDelete: (commentId: string | number) => void;
  onEdit: (commentId: string | number) => void;
  replyingTo: string | number | null;
  editingId: string | number | null;
  onCancelReply: () => void;
  onCancelEdit: () => void;
  postId: string | number;
  isNested?: boolean;
}

function CommentItem({
  comment,
  currentUser,
  onReply,
  onDelete,
  onEdit,
  replyingTo,
  editingId,
  onCancelReply,
  onCancelEdit,
  postId,
  isNested = false,
}: CommentItemProps) {
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const isOwner = currentUser?.id.toString() === comment.userId.toString();
  const isReplying = replyingTo === comment.id;
  const isEditing = editingId === comment.id;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleReplySubmit = async (data: CommentFormValues) => {
    try {
      await createComment.mutateAsync({
        postId,
        content: data.content,
        parentId: comment.id,
      });
      onCancelReply();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEditSubmit = async (data: CommentFormValues) => {
    try {
      await updateComment.mutateAsync({
        id: comment.id,
        content: data.content,
      });
      onCancelEdit();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className={isNested ? 'ml-10' : ''}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
          <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{comment.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
                {comment.updatedAt && comment.updatedAt !== comment.createdAt && ' (edited)'}
              </span>
            </div>

            {isOwner && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => (isEditing ? onCancelEdit() : onEdit(comment.id))}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(comment.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <MainForm
                validationSchema={commentSchema}
                defaultValues={{ content: comment.content }}
                onSubmit={handleEditSubmit}
              >
                <MainForm.Field
                  name="content"
                  component={Textarea}
                  placeholder="Edit your comment..."
                  className="min-h-[60px] resize-none"
                  disabled={updateComment.isPending}
                />

                <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onCancelEdit}
                      disabled={updateComment.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={updateComment.isPending}
                      className="gap-2"
                    >
                      {updateComment.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Save
                    </Button>
                  </div>
              </MainForm>
            </div>
          ) : (
            <>
              <p className="text-sm">{comment.content}</p>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => (isReplying ? onCancelReply() : onReply(comment.id))}
              >
                <MessageCircle className="h-3 w-3" />
                {isReplying ? 'Cancel' : 'Reply'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-3 ml-11">
          <MainForm
            validationSchema={commentSchema}
            defaultValues={{ content: '' }}
            onSubmit={handleReplySubmit}
          >
            <MainForm.Field
              name="content"
              component={Textarea}
              placeholder={`Reply to ${comment.user.name}...`}
              className="min-h-[60px] resize-none"
              disabled={createComment.isPending}
            />

            <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancelReply}
                  disabled={createComment.isPending}
                >
                  Cancel
                </Button>
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
                  Reply
                </Button>
              </div>
          </MainForm>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onReply={onReply}
              onDelete={onDelete}
              onEdit={onEdit}
              replyingTo={replyingTo}
              editingId={editingId}
              onCancelReply={onCancelReply}
              onCancelEdit={onCancelEdit}
              postId={postId}
              isNested
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user: currentUser } = useAuth();
  const { data: comments, isLoading } = useComments(postId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);

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
        parentId: null,
      });
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
      <MainForm
        validationSchema={commentSchema}
        defaultValues={{ content: '' }}
        onSubmit={onSubmit}
      >
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
            <AvatarFallback>
              {currentUser ? getInitials(currentUser.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <MainForm.Field
              name="content"
              component={Textarea}
              placeholder="Write a comment..."
              className="min-h-[60px] resize-none"
              disabled={createComment.isPending}
            />
          </div>
        </div>

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
      </MainForm>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={setReplyingTo}
              onDelete={handleDelete}
              onEdit={setEditingId}
              replyingTo={replyingTo}
              editingId={editingId}
              onCancelReply={() => setReplyingTo(null)}
              onCancelEdit={() => setEditingId(null)}
              postId={postId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}
