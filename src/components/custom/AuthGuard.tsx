'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // Redirect to login if authentication is required
        router.push('/login');
      } else if (!requireAuth && user) {
        // Redirect to home if already authenticated (for login/register pages)
        router.push('/');
      }
    }
  }, [user, isLoading, requireAuth, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // For protected routes, don't render until authenticated
  if (requireAuth && !user) {
    return null;
  }

  // For auth pages (login/register), don't render if already authenticated
  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}
