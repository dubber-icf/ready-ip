import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/ui/Sidebar';

export const metadata: Metadata = {
  title: 'READY IP — Patent Intelligence for Supply Chain Resilience',
  description: 'Supply chain intelligence platform combining patent landscape analysis with resilience monitoring.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-carbon-texture bg-blueprint-grid min-h-screen">
        <Sidebar />
        <main className="ml-56 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
