'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ConnectExportModal } from './ConnectExportModal';

interface ConnectedSummary {
  slug: string;
  name: string;
  accountLabel: string;
}

interface Props {
  connected: ConnectedSummary[];
  existingKeyPrefixes: string[];
  variant?: 'hero' | 'sticky' | 'inline';
  disabled?: boolean;
  label?: string;
}

export function ConnectExportButton({
  connected,
  existingKeyPrefixes,
  variant = 'hero',
  disabled,
  label,
}: Props) {
  const [open, setOpen] = useState(false);

  const text = label ?? (variant === 'sticky' ? 'Connect to Claude' : 'Connect to Claude / Cursor');

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={
          variant === 'hero'
            ? 'inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent text-bg font-bold text-sm hover:opacity-90 transition disabled:opacity-40 shadow-[0_12px_32px_-8px_rgba(198,255,0,0.45)]'
            : variant === 'sticky'
              ? 'inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-accent text-bg font-bold text-sm hover:opacity-90 disabled:opacity-40'
              : 'inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-accent/40 text-accent text-xs font-semibold hover:bg-accent/10'
        }
      >
        <Sparkles className="w-4 h-4" />
        {text}
        <ArrowRight className="w-4 h-4" />
      </button>

      {open && (
        <ConnectExportModal
          connected={connected}
          existingKeyPrefixes={existingKeyPrefixes}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
