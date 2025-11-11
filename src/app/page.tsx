'use client';

import { AuthGuard } from '@/components/custom/AuthGuard';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuth();

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
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-2xl font-bold">Social Media</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto flex-1 p-4">
          <div className="mx-auto max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Welcome, {user?.name}!
                </CardTitle>
                <CardDescription>
                  You are successfully logged in to the Social Media platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-semibold">Your Profile Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-medium">{user?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                    Authentication Status
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ✓ You are authenticated and can access protected routes.
                  </p>
                  <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                    ✓ Your session is being managed by the AuthProvider.
                  </p>
                  <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                    ✓ Your authentication token is persisted in local storage.
                  </p>
                </div>

                <Button variant="outline" onClick={logout} className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About This Demo</CardTitle>
                <CardDescription>
                  Authentication implementation details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">✓ Reusable AuthProvider Component</p>
                  <p className="text-muted-foreground">
                    Using React Context API to manage authentication state globally
                  </p>
                </div>
                <div>
                  <p className="font-medium">✓ API Integration</p>
                  <p className="text-muted-foreground">
                    Connected to json-server for mock authentication API
                  </p>
                </div>
                <div>
                  <p className="font-medium">✓ State Management</p>
                  <p className="text-muted-foreground">
                    Using useState for managing user info and authentication token
                  </p>
                </div>
                <div>
                  <p className="font-medium">✓ Persistent Authentication</p>
                  <p className="text-muted-foreground">
                    Token stored in localStorage for session persistence
                  </p>
                </div>
                <div>
                  <p className="font-medium">✓ Protected Routes</p>
                  <p className="text-muted-foreground">
                    AuthGuard component ensures proper access control
                  </p>
                </div>
                <div>
                  <p className="font-medium">✓ Custom Hook (useAuth)</p>
                  <p className="text-muted-foreground">
                    Easy consumption of auth context across components
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

