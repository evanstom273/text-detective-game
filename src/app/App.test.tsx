import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('developer interface shell', () => {
  it('renders empty case-generator sections without enabling generator controls', () => {
    render(<App />);

    expect(screen.getByText('Text Detective Game')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'V0 Case Generator' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CASE GENERATOR' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CASE TRUTH' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AUTOMATED VALIDATION' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'BULK GENERATION' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'RAW UNDERLYING DATA' })).toBeInTheDocument();

    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
      'Victim',
      'Cause of death',
      'Time of death',
      'Perpetrator',
      'Motive',
      'Method',
      'Timeline',
      'Evidence',
      'Other suspects',
      'Relevant / misleading circumstances',
      'Generated:',
      'Passed validation:',
      'Failed validation:',
    ]);

    expect(screen.getByLabelText('Seed:')).toBeDisabled();
    expect(screen.getByLabelText('Number of cases:')).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Generate' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Generate' }).every((button) => button.hasAttribute('disabled'))).toBe(true);
    expect(screen.getByRole('button', { name: 'Random Seed' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Download All' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Download Failures' })).toBeDisabled();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('NOT RUN')).toBeInTheDocument();
    expect(screen.getAllByText('Not run')).toHaveLength(11);
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
    expect(screen.getByText('Nothing generated yet.')).toBeInTheDocument();
  });
});
