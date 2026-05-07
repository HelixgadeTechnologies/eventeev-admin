'use client';

import Sidebar from '@/components/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* Shifted main content to account for floating sidebar */}
      <main className="pl-80 pr-6 py-6">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
