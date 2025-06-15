
'use client';

import { Cpu, LogIn, LogOut, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, logoutUser, loading } = useAuth();

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Cpu className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-2xl font-headline font-semibold text-primary">
            GPT Mine
          </h1>
        </Link>
        
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <>
              {user.email && <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>}
              <Button variant="outline" size="sm" onClick={logoutUser}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
