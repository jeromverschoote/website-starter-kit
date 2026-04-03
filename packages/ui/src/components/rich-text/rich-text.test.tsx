import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { RichText } from './rich-text';

// @portabletext/react is mocked globally via vitest.config.ts aliases

const value = [{ _type: 'block', _key: '1', children: [{ _type: 'span', text: 'Hello' }] }];

describe('RichText', () => {
  it('renders the PortableText component', () => {
    render(<RichText value={value} />);
    expect(screen.getByTestId('portable-text')).toBeInTheDocument();
  });

  it('applies a custom className', () => {
    render(<RichText value={value} className="custom-class" />);
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('applies styling classes when hasStyling is true (default)', () => {
    render(<RichText value={value} />);
    // The container should have the styles.container class applied
    const container = screen.getByTestId('portable-text').parentElement;
    expect(container).toBeInTheDocument();
  });

  it('does not apply styling classes when hasStyling is false', () => {
    const { container } = render(<RichText value={value} hasStyling={false} />);
    // The outer div should not have a styles class when hasStyling is false
    expect(container.firstChild).toBeInTheDocument();
  });
});
