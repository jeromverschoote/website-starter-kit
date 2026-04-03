import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import Container from './container';

describe('Container', () => {
  it('renders its children', () => {
    render(<Container>Hello world</Container>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('applies a custom className to the inner content wrapper', () => {
    render(<Container className="custom-class">Content</Container>);
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders nested children correctly', () => {
    render(
      <Container>
        <p>First</p>
        <p>Second</p>
      </Container>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
