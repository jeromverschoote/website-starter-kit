import { ReactNode } from 'react';

type TProps<T> = {
  items: T[];
  render: (item: T, index: number) => ReactNode;
  config?: {
    columns: number[];
    gap: number[];
    media: number[];
  };
};

export const Masonry = <T,>({
  items,
  render,
}: TProps<T>) => <div data-testid="masonry">{items.map((item, i) => render(item, i))}</div>;
