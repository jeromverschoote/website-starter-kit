import { ReactNode } from 'react';

import { toClassName } from 'helpers/format';

import { styles } from '.';

export type TProps = {
  children: ReactNode;
  className?: string;
};

const Container = (props: TProps) => {
  const { children, className } = props;

  return (
    <div className={styles.container}>
      <div className={toClassName(styles.content, className)}>{children}</div>
    </div>
  );
};

export default Container;
