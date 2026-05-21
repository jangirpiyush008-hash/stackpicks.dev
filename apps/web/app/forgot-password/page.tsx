import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { ForgotPasswordForm } from '../../components/ForgotPasswordForm';

export const metadata = {
  title: 'Forgot password',
  description: 'Get a password reset link sent to your email.',
};

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center px-4 py-12">
      <div className="max-w-md mx-auto w-full">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <KeyRound className="w-3.5 h-3.5 text-accent" />
            <span>Password reset</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">Forgot password?</h1>
          <p className="text-sm text-muted">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
          <ForgotPasswordForm />
        </div>

        <p className="text-center text-xs text-muted mt-5">
          Signed up with Google?{' '}
          <Link href="/login" className="text-accent underline underline-offset-2">
            Sign in with Google
          </Link>{' '}
          instead — your account doesn&apos;t have a password.
        </p>
      </div>
    </div>
  );
}
