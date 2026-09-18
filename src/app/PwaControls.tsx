import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { usePwaInstall } from './pwa';

export function PwaControls() {
  const { canInstall, install, isInstalled } = usePwaInstall();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    await install();
    setIsInstalling(false);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateFailed(false);

    try {
      await updateServiceWorker(true);
    } catch {
      setIsUpdating(false);
      setUpdateFailed(true);
    }
  };

  const dismissUpdate = () => {
    setNeedRefresh(false);
    setUpdateFailed(false);
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-3" aria-live="polite">
      {isInstalled && (
        <p className="text-sm text-slate-400" role="status">
          Installed app
        </p>
      )}

      {!isInstalled && canInstall && (
        <button
          className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 disabled:cursor-wait disabled:opacity-60"
          type="button"
          onClick={handleInstall}
          disabled={isInstalling}
        >
          {isInstalling ? 'Installing…' : 'Install App'}
        </button>
      )}

      {needRefresh && (
        <div className="flex flex-col items-center gap-2 rounded-md border border-slate-700 px-4 py-3">
          <p className="text-sm text-slate-200" role="status">
            Update available
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-950 disabled:cursor-wait disabled:opacity-60"
              type="button"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating…' : 'Update now'}
            </button>
            <button
              className="rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-300"
              type="button"
              onClick={dismissUpdate}
              disabled={isUpdating}
            >
              Later
            </button>
          </div>
        </div>
      )}

      {updateFailed && (
        <p className="text-sm text-rose-300" role="alert">
          Could not apply the update. Please try again.
        </p>
      )}
    </div>
  );
}
