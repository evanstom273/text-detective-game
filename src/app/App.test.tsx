import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('developer interface shell', () => {
  it('renders the responsive case-generator workbench', () => {
    render(<App />);

    expect(screen.getByText('Text Detective Game')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'V0 Case Generator' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CASE GENERATOR' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CASE TRUTH' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AUTOMATED VALIDATION' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'BULK GENERATION' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'RAW UNDERLYING DATA' })).toBeInTheDocument();

    expect(screen.getByLabelText('Seed:')).toBeEnabled();
    expect(screen.getByLabelText('Number of cases:')).toBeEnabled();
    expect(screen.getAllByRole('button', { name: 'Generate' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Random Seed' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Download JSON' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Download Markdown' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Download Failures' })).toBeDisabled();
    expect(screen.getByText('No case generated yet.')).toBeInTheDocument();
    expect(screen.getByText('Nothing generated yet.')).toBeInTheDocument();

    for (const check of [
      'Victim alive before fatal event',
      'Murder occurs within time-of-death window',
      'Body discovered after murder',
      'Timeline is chronological',
      'Perpetrator can reach murder location',
      'Weapon exists and is available',
      'Witness is capable of witnessing claimed event',
      'Motive exists before murder',
      'Relationships are internally consistent',
      'Evidence derives from an actual event',
      'Generated statements do not require impossible knowledge',
    ]) {
      expect(screen.getByText(check)).toBeInTheDocument();
    }
  });

  it('presents generated facts as a unified human-readable case truth', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Seed:'), { target: { value: 'ui-narrative-test' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Generate' })[0]!);

    expect(screen.getByText('Victim')).toBeInTheDocument();
    expect(screen.getByText('Murder')).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
    expect(screen.getByText('Exact death')).toBeInTheDocument();
    expect(screen.getByText('Estimated TOD')).toBeInTheDocument();
    expect(screen.getByText('Time zone')).toBeInTheDocument();
    expect(screen.getByText('Show structured case facts')).toBeInTheDocument();
    expect(screen.getByText('Perpetrator')).toBeInTheDocument();
    expect(screen.getByText('Motive')).toBeInTheDocument();
  });
});
