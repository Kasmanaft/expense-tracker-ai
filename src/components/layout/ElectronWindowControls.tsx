'use client';

import { useEffect, useState } from 'react';

export function ElectronWindowControls() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check for Electron environment
    const userAgent = window.navigator.userAgent.toLowerCase();
    const electronDetected = userAgent.indexOf(' electron/') > -1;
    setIsElectron(electronDetected);

    // Add a class to the body when in Electron
    if (electronDetected) {
      document.body.classList.add('electron-app');

      // Add padding to the main content container
      const mainContent = document.querySelector('.min-h-screen');
      if (mainContent) {
        mainContent.classList.add('electron-content-offset');
      }
    }

    return () => {
      // Cleanup
      document.body.classList.remove('electron-app');
      const mainContent = document.querySelector('.min-h-screen');
      if (mainContent) {
        mainContent.classList.remove('electron-content-offset');
      }
    };
  }, []);

  if (!isElectron) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-gray-100 z-50 electron-drag-region">
      {/* This is an empty div that serves as a draggable region for the window controls */}
    </div>
  );
}
