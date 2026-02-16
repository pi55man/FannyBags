import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FannyBags',
  description: 'Launch your music campaign with styles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-[#030303] font-sans antialiased flex`}>

        {/* Sidebar - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col transition-all duration-300 lg:pl-[280px]">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}
