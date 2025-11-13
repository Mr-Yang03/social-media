'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/custom/AuthGuard';
import { Navbar } from '@/components/custom/Navbar';
import { PostDialog } from '@/components/custom/PostDialog';
import { PostCard } from '@/components/custom/PostCard';
import { useUserPosts } from '@/api/post/queries';
import { useUIStore } from '@/stores/ui-store';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Loader2, Calendar, Mail } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { User } from '@/api/user/types';
import { formatDistanceToNow } from 'date-fns';

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await apiClient.get<User>(`/users/${userId}`);
      return response.data;
    },
  });

  const { data: posts, isLoading: isLoadingPosts } = useUserPosts(userId);
  const editingPostId = useUIStore((state) => state.editingPostId);
  const editingPost = posts?.find((p) => p.id === editingPostId) || null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <PostDialog mode="create" />
        <PostDialog mode="edit" post={editingPost} />

        <main className="container mx-auto max-w-4xl px-4 py-8">
          {isLoadingUser ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : user ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        {user.bio && (
                          <p className="mt-2 text-muted-foreground">{user.bio}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Joined{' '}
                          {formatDistanceToNow(new Date(user.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>

                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="font-bold text-lg">
                            {posts?.length || 0}
                          </span>{' '}
                          <span className="text-muted-foreground">Posts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* User Posts */}
              <div>
                <h2 className="mb-4 text-2xl font-bold">Posts</h2>

                {isLoadingPosts ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </CardContent>
                  </Card>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      No posts yet.
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                User not found
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
