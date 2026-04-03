import { render } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import Icon from './icon';

// FontAwesome Pro packages are mocked globally via vitest.config.ts aliases

describe('Icon', () => {
  it('renders the icon wrapper', () => {
    render(<Icon accessor="coffee" type="sharp-light" />);
    expect(document.querySelector('[data-testid="fa-icon"]')).toBeInTheDocument();
  });

  it('applies a custom className', () => {
    render(<Icon accessor="coffee" className="text-red-500" />);
    const wrapper = document.querySelector('.text-red-500');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders for each supported type', () => {
    const types = ['brands', 'sharp-light', 'sharp'] as const;
    types.forEach((type) => {
      const { unmount } = render(<Icon accessor="star" type={type} />);
      expect(document.querySelector('[data-testid="fa-icon"]')).toBeInTheDocument();
      unmount();
    });
  });

  it('applies the size style to the wrapper', () => {
    render(<Icon accessor="coffee" size="24px" />);
    const wrapper = document.querySelector('div[style]') as HTMLElement;
    expect(wrapper?.style.width).toBe('24px');
    expect(wrapper?.style.height).toBe('24px');
  });
});
