import { AuthGuard } from '@/components/custom/AuthGuard';
import { LoginSection } from '@/section/login';

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoginSection />
      </div>
    </AuthGuard>
  );
}
