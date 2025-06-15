
'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type AuthFormInput = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { loginWithEmail, signupWithEmail } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInput>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit: SubmitHandler<AuthFormInput> = async (data) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(data);
        toast({ title: 'Login Successful', description: "Welcome back!" });
      } else {
        await signupWithEmail(data);
        toast({ title: 'Signup Successful', description: "Welcome to GPT Mine!" });
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = "Invalid email or password.";
            break;
          case 'auth/email-already-in-use':
            errorMessage = "This email is already registered. Please login or use a different email.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak. It should be at least 6 characters long.";
            break;
          default:
            errorMessage = error.message || "Authentication failed.";
        }
      }
      toast({
        variant: 'destructive',
        title: mode === 'login' ? 'Login Failed' : 'Signup Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login' ? 'Sign in to continue to GPT Mine.' : 'Sign up to get started with GPT Mine.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={isLoading}
              className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
              className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <Button variant="link" asChild className="pl-1">
            <Link href={mode === 'login' ? '/signup' : '/login'}>
              {mode === 'login' ? 'Sign up' : 'Login'}
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

