import { AuthGuard } from '@/components/custom/AuthGuard';
import { RegisterForm } from '@/components/custom/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <RegisterForm />
      </div>
    </AuthGuard>
  );
}
