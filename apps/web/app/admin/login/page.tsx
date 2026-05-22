import { redirect } from 'next/navigation';
import { AdminLoginForm } from '../../../components/AdminLoginForm';
import { isAdmin } from '../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Console · Restricted',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // If already an admin, skip the login screen.
  const gate = await isAdmin();
  if (gate.ok) redirect('/admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-10 font-mono">
      {/* CRT scanline + grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, #c6ff00 2px, #c6ff00 3px)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#c6ff00 1px, transparent 1px), linear-gradient(90deg, #c6ff00 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Restricted banner */}
        <div className="mb-4 text-center">
          <div className="inline-block px-3 py-1 border border-red-500/60 bg-red-500/10 text-red-300 text-[10px] uppercase tracking-[0.2em] rounded">
            ▲ Restricted Area
          </div>
        </div>

        {/* Terminal box */}
        <div className="border border-accent/40 bg-black/60 backdrop-blur-xl rounded-md shadow-[0_0_40px_-10px_rgba(198,255,0,0.3)] overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 border-b border-accent/30">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent ml-2">
              stackpicks://admin/console
            </span>
          </div>

          {/* Body */}
          <div className="p-6">
            <pre className="text-[10px] leading-tight text-accent/80 mb-5 select-none">
{`╔══════════════════════════════════════════╗
║   STACKPICKS  ADMIN  CONSOLE  v1.0      ║
║   AUTHORIZED PERSONNEL ONLY              ║
╚══════════════════════════════════════════╝`}
            </pre>

            <div className="text-xs text-accent/70 mb-1">
              <span className="text-accent">$</span> system.identify_operator()
            </div>
            <div className="text-[11px] text-muted mb-6">
              All access attempts are logged with IP, timestamp, and credential hash.
              <br />
              Failed authentication will trigger session lockout.
            </div>

            <AdminLoginForm />
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-accent/20 bg-accent/[0.03] text-[10px] text-muted/60">
            <span className="text-accent/60">●</span> Connection: TLS 1.3 · Region: ap-south-1 · Session: not yet authenticated
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] text-muted/50 uppercase tracking-[0.2em]">
          Unauthorized access is a violation of IT Act, 2000
        </p>
      </div>
    </div>
  );
}
