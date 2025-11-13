'use client';

import { useState } from 'react';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import MainForm from '@/components/custom/MainForm';
import { PasswordInput } from '@/components/custom/PasswordInput';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setSuccess('Account created successfully! Redirecting to login...');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <MainForm 
        validationSchema={registerSchema} 
        defaultValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={onSubmit}
      >
        <MainForm.Field
          name="name"
          label="Name"
          component={Input}
          type="text"
          placeholder="John Doe"
          disabled={isLoading}
        />

        <MainForm.Field
          name="email"
          label="Email"
          component={Input}
          type="email"
          placeholder="name@example.com"
          disabled={isLoading}
        />

        <MainForm.Field
          name="password"
          label="Password"
          component={PasswordInput}
          placeholder="••••••••"
          className="pr-10"
          disabled={isLoading}
        />

        <MainForm.Field
          name="confirmPassword"
          label="Confirm Password"
          component={PasswordInput}
          placeholder="••••••••"
          className="pr-10"
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </MainForm>
    </>
  );
}
