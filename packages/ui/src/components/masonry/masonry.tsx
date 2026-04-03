import { ReactNode } from "react";

import { Masonry as Component } from "react-plock";

type TProps<T> = {
  items: T[];
  config: {
    columns: number[];
    gap: number[];
    media: number[];
  };
  render: (item: T, index: number) => ReactNode;
};

const Masonry = <T,>(props: TProps<T>) => {
  return <Component {...props} />;
};

export default Masonry;
