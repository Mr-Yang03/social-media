'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { MessageCircle, MoreVertical, Trash2, Edit, X } from 'lucide-react';
import { PostWithUser } from '@/api/post/types';
import { useAuth } from '@/hooks/useAuth';
import { useDeletePost } from '@/api/post/mutations';
import { useUIStore } from '@/stores/ui-store';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: PostWithUser;
}

export function PostCard({ post }: PostCardProps) {
  const { user: currentUser } = useAuth();
  const deletePost = useDeletePost();
  const [showComments, setShowComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const setEditPostOpen = useUIStore((state) => state.setEditPostOpen);
  const setEditingPostId = useUIStore((state) => state.setEditingPostId);

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

  const handleEdit = () => {
    setEditingPostId(post.id);
    setEditPostOpen(true);
  };

  return (
    <>
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
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
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

        {/* Image Gallery */}
        {post.images && post.images.length > 0 && (
          <div className={`mt-4 grid gap-2 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-2 md:grid-cols-3'
          }`}>
            {post.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-md"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
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

      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size"
                className="max-h-[80vh] w-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
