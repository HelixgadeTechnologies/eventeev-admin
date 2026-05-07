'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main className="pl-64 pt-20">
        <div className="p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
