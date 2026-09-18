import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('development placeholder', () => {
  it('renders the project name and build label', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Text Detective Game' })).toBeInTheDocument();
    expect(screen.getByText('Case Generator — development build')).toBeInTheDocument();
  });
});
