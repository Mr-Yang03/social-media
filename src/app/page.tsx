'use client';

import { AuthGuard } from '@/components/custom/AuthGuard';
import { Navbar } from '@/components/custom/Navbar';
import { CreatePostDialog } from '@/components/custom/CreatePostDialog';
import { PostCard } from '@/components/custom/PostCard';
import { usePosts } from '@/hooks/use-posts';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { data: posts, isLoading, error } = usePosts();

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <CreatePostDialog />

        <main className="container mx-auto max-w-2xl px-4 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Home Feed</h1>
              <p className="text-muted-foreground">
                Catch up with what&apos;s happening
              </p>
            </div>

            {/* Posts */}
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Failed to load posts. Please try again later.
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
                  No posts yet. Be the first to share something!
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

