import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'admin — North',
  description: 'Monitor and control the North platform.',
};

// Always run the auth gate on the server — never statically serve admin.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Gate the entire admin surface behind the ADMIN role.
  const session = await auth();
  if (!session?.user) redirect('/login');
  if ((session.user as { role?: string }).role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans">
      <div className="flex">
        <AdminSidebar />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">{children}</div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
