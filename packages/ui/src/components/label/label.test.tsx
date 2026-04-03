import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { Label } from './label';

describe('Label', () => {
  it('renders its text content', () => {
    render(<Label>Email address</Label>);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('associates with an input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email');
  });

  it('forwards a custom className', () => {
    render(<Label className="custom-class">Label</Label>);
    expect(screen.getByText('Label')).toHaveClass('custom-class');
  });

  it('renders the default label variant classes', () => {
    render(<Label>Label</Label>);
    expect(screen.getByText('Label')).toHaveClass('text-sm', 'font-medium');
  });
});
