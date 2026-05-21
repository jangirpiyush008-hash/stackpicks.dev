import { KeyRound } from 'lucide-react';
import { ResetPasswordForm } from '../../components/ResetPasswordForm';

export const metadata = {
  title: 'Set new password',
  description: 'Choose a new password for your StackPicks account.',
};

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center px-4 py-12">
      <div className="max-w-md mx-auto w-full">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <KeyRound className="w-3.5 h-3.5 text-accent" />
            <span>Set new password</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">Choose a new password</h1>
          <p className="text-sm text-muted">
            Pick something at least 8 characters. You&apos;ll be signed in automatically.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
