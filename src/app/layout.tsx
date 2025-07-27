'use client';

import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { DevHelper } from '@/components/DevHelper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if running in Electron
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check for Electron environment
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsElectron(userAgent.indexOf(' electron/') > -1);
  }, []);

  return (
    <html lang="en" className={isElectron ? 'electron-app' : ''}>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Add extra padding at the top when running in Electron */}
          {isElectron && (
            <div className="h-10 bg-gray-50 fixed top-0 left-0 right-0 z-50" />
          )}
          <div className={isElectron ? 'pt-10' : ''}>
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <DevHelper />
          </div>
        </div>
      </body>
    </html>
  );
}
