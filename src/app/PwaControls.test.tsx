import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PwaControls } from './PwaControls';

const pwaMock = vi.hoisted(() => ({
  needRefresh: false,
  updateServiceWorker: vi.fn(),
}));

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [pwaMock.needRefresh, vi.fn()],
    offlineReady: [false, vi.fn()],
    updateServiceWorker: pwaMock.updateServiceWorker,
  }),
}));

function createInstallEvent(outcome: 'accepted' | 'dismissed' = 'accepted') {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  const prompt = vi.fn().mockResolvedValue(undefined);

  Object.defineProperties(event, {
    prompt: { value: prompt },
    userChoice: {
      value: Promise.resolve({ outcome, platform: 'test' }),
    },
  });

  return { event, prompt };
}

describe('PWA controls', () => {
  beforeEach(() => {
    pwaMock.needRefresh = false;
    pwaMock.updateServiceWorker.mockReset();
    pwaMock.updateServiceWorker.mockResolvedValue(undefined);
  });

  it('only offers installation after the browser exposes an install prompt', async () => {
    render(<PwaControls />);

    expect(screen.queryByRole('button', { name: 'Install App' })).not.toBeInTheDocument();

    const { event, prompt } = createInstallEvent();
    act(() => window.dispatchEvent(event));

    const installButton = await screen.findByRole('button', { name: 'Install App' });
    await act(async () => fireEvent.click(installButton));

    expect(prompt).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Install App' })).not.toBeInTheDocument();
    });
  });

  it('cleans up after installation is dismissed and reflects an installed app', async () => {
    render(<PwaControls />);

    const dismissed = createInstallEvent('dismissed');
    act(() => window.dispatchEvent(dismissed.event));
    const installButton = await screen.findByRole('button', { name: 'Install App' });

    await act(async () => fireEvent.click(installButton));
    expect(screen.queryByRole('button', { name: 'Install App' })).not.toBeInTheDocument();

    act(() => window.dispatchEvent(new Event('appinstalled')));
    expect(screen.getByText('Installed app')).toBeInTheDocument();
  });

  it('shows a prompt for service-worker updates and applies the update on request', async () => {
    pwaMock.needRefresh = true;
    render(<PwaControls />);

    expect(screen.getByText('Update available')).toBeInTheDocument();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Update now' })));

    expect(pwaMock.updateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('reports an update failure without reloading automatically', async () => {
    pwaMock.needRefresh = true;
    pwaMock.updateServiceWorker.mockRejectedValueOnce(new Error('update failed'));
    render(<PwaControls />);

    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Update now' })));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not apply the update.');
  });
});
