import { render } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import Icon from './icon';

/** The path data of the icon drawn, to compare two renders. */
const draw = (props: Parameters<typeof Icon>[0]) =>
  render(<Icon {...props} />).container.querySelector('svg')?.innerHTML;

describe('Icon', () => {
  it('draws a Phosphor icon by its name, hidden from screen readers', () => {
    const { container } = render(<Icon accessor="caret-down" type="bold" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws the weight it is given', () => {
    expect(draw({ accessor: 'check', type: 'thin' })).not.toBe(
      draw({ accessor: 'check', type: 'bold' }),
    );
  });

  it('draws bold for a weight Phosphor does not have', () => {
    expect(draw({ accessor: 'check', type: 'sharp-light' })).toBe(
      draw({ accessor: 'check', type: 'bold' }),
    );
    expect(draw({ accessor: 'check' })).toBe(
      draw({ accessor: 'check', type: 'bold' }),
    );
  });

  it('still draws the old Font Awesome names, until the migration ran', () => {
    expect(draw({ accessor: 'chevron-down', type: 'regular' })).toBe(
      draw({ accessor: 'caret-down', type: 'regular' }),
    );
    expect(draw({ accessor: 'xmark', type: 'brands' })).toBe(
      draw({ accessor: 'x', type: 'bold' }),
    );
  });

  it('applies a custom className', () => {
    const { container } = render(
      <Icon accessor="cookie" className="text-red-500" />,
    );

    expect(container.querySelector('.text-red-500')).toBeInTheDocument();
  });

  it('applies the size to the box it keeps', () => {
    const { container } = render(<Icon accessor="cookie" size="24px" />);

    expect(container.firstChild).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('draws nothing for a name it does not know, but keeps its room', () => {
    const { container } = render(<Icon accessor="no-such-icon" />);

    expect(container.querySelector('svg')).toBeNull();
    expect(container.firstChild).toHaveStyle({ width: '16px', height: '16px' });
  });
});
