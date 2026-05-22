import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// /admin/login is now folded into /admin (login UI renders inline there).
// Kept as a redirect for any saved bookmarks.
export default function AdminLoginRedirect() {
  redirect('/admin');
}
