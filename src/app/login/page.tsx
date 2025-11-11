import { AuthGuard } from '@/components/custom/AuthGuard';
import { LoginForm } from '@/components/custom/LoginForm';

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoginForm />
      </div>
    </AuthGuard>
  );
}
