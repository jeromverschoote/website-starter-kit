import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import Masonry from './masonry';

// react-plock is mocked globally via vitest.config.ts aliases

const config = { columns: [1, 2, 3], gap: [8, 16, 24], media: [640, 768, 1024] };

describe('Masonry', () => {
  it('renders all items via the render prop', () => {
    const items = ['Apple', 'Banana', 'Cherry'];
    render(
      <Masonry
        items={items}
        config={config}
        render={(item) => <div key={item}>{item}</div>}
      />,
    );
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('renders nothing for an empty items array', () => {
    const { container } = render(
      <Masonry items={[]} config={config} render={() => <div>Item</div>} />,
    );
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="masonry"]')).toBeInTheDocument();
  });

  it('passes the correct index to the render prop', () => {
    const items = ['A', 'B'];
    const indices: number[] = [];
    render(
      <Masonry
        items={items}
        config={config}
        render={(item, index) => {
          indices.push(index);
          return <div key={item}>{item}</div>;
        }}
      />,
    );
    expect(indices).toEqual([0, 1]);
  });
});
