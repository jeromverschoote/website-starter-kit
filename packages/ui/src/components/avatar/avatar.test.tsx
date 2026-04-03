import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

describe('Avatar', () => {
  it('renders the avatar container', () => {
    render(<Avatar />);
    expect(document.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
  });

  it('renders fallback text when no image is provided', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders the fallback when the image fails to load (jsdom)', () => {
    // In jsdom images never load, so Radix always shows the fallback.
    // We verify the component renders without errors when an image src is provided.
    render(
      <Avatar>
        <AvatarImage src="/avatar.jpg" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies a custom className to Avatar', () => {
    render(<Avatar className="custom-avatar" />);
    expect(document.querySelector('[data-slot="avatar"]')).toHaveClass('custom-avatar');
  });

  it('applies a custom className to AvatarFallback', () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">AB</AvatarFallback>
      </Avatar>,
    );
    expect(document.querySelector('[data-slot="avatar-fallback"]')).toHaveClass('custom-fallback');
  });
});
