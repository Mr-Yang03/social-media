'use client';

import { AuthGuard } from '@/components/custom/AuthGuard';
import { Navbar } from '@/components/custom/Navbar';
import { PostDialog } from '@/components/custom/PostDialog';
import { usePosts } from '@/api/post/queries';
import { useUIStore } from '@/stores/ui-store';

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { data: posts } = usePosts();
  const editingPostId = useUIStore((state) => state.editingPostId);
  const editingPost = posts?.find((p) => p.id === editingPostId) || null;

  return (
    <AuthGuard requireAuth={requireAuth}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <PostDialog mode="create" />
        <PostDialog mode="edit" post={editingPost} />
        {children}
      </div>
    </AuthGuard>
  );
}
