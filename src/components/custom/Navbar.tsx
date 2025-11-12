'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Home, Moon, Sun, User, LogOut, PlusCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/ui-store';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const setCreatePostOpen = useUIStore((state) => state.setCreatePostOpen);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            S
          </div>
          Social
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </Link>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setCreatePostOpen(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Create Post</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user?.id}`}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
