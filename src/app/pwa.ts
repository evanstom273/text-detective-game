import { useCallback, useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

export function isStandaloneApp(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const displayModeStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone = (navigator as NavigatorWithStandalone).standalone === true;

  return displayModeStandalone || iosStandalone;
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneApp);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      if (!isStandaloneApp()) {
        setInstallPrompt(event as BeforeInstallPromptEvent);
      }
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    const handleDisplayModeChange = () => {
      setIsInstalled(isStandaloneApp());
    };

    const displayModeQuery = window.matchMedia?.('(display-mode: standalone)');

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    displayModeQuery?.addEventListener?.('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      displayModeQuery?.removeEventListener?.('change', handleDisplayModeChange);
    };
  }, []);

  const install = useCallback(async () => {
    if (!installPrompt) {
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        setIsInstalled(isStandaloneApp());
      }
    } catch {
      // Installation can be rejected by the browser or platform. The prompt is
      // discarded below, and a future browser event may offer it again.
    } finally {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  return {
    canInstall: !isInstalled && installPrompt !== null,
    install,
    isInstalled,
  };
}
