import { AuthGuard } from '@/components/custom/AuthGuard';
import { RegisterSection } from '@/section/register';

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <RegisterSection />
      </div>
    </AuthGuard>
  );
}
