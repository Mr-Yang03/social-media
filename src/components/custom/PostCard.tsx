'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import { PostWithUser } from '@/types/post';
import { useAuth } from '@/hooks/use-auth';
import { useDeletePost } from '@/hooks/use-posts';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: PostWithUser;
}

export function PostCard({ post }: PostCardProps) {
  const { user: currentUser } = useAuth();
  const deletePost = useDeletePost();
  const [showComments, setShowComments] = useState(false);

  const isOwner = currentUser?.id.toString() === post.userId.toString();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost.mutateAsync(post.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.userId}`}>
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                href={`/profile/${post.userId}`}
                className="font-semibold hover:underline"
              >
                {post.user.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>

      <CardFooter className="flex-col items-start gap-4">
        <div className="flex w-full gap-2">
          <Button
            variant={showComments ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {post.commentsCount || 0} Comments
          </Button>
        </div>

        {showComments && <CommentSection postId={post.id} />}
      </CardFooter>
    </Card>
  );
}
