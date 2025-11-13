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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    setIsLoading(true);

    try {
      await login(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
      
      <MainForm 
        validationSchema={loginSchema} 
        defaultValues={{
          email: '',
          password: '',
        }}
        onSubmit={onSubmit}
      >
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </MainForm>
    </>
  );
}
