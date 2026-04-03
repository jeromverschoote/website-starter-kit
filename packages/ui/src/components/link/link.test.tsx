import { render, screen } from '@testing-library/react';

import { describe, it, expect } from 'vitest';

import Link from './link';

describe('Link', () => {
  it('renders children inside an anchor', () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('sets href correctly', () => {
    render(<Link href="/contact">Contact</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/contact');
  });

  it('sets target to _blank when isExternal is true', () => {
    render(<Link href="https://example.com" isExternal>Visit</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('does not set target to _blank when isExternal is false', () => {
    render(<Link href="/internal">Internal</Link>);
    expect(screen.getByRole('link')).not.toHaveAttribute('target', '_blank');
  });

  it('renders an external icon when isExternal is true', () => {
    render(<Link href="https://example.com" isExternal>Visit</Link>);
    // Icon renders an svg or img — the container should have 2 children
    const container = screen.getByRole('link').parentElement;
    expect(container?.children.length).toBeGreaterThan(1);
  });

  it('passes className through', () => {
    render(<Link href="/" className="custom-class">Home</Link>);
    expect(screen.getByRole('link')).toHaveClass('custom-class');
  });
});
