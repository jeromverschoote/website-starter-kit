import { ReactNode } from 'react';

import Container from '@repo/ui/container';

import { TLocale } from 'config/i18n';

import { styles } from '.';

type TProps = {
  children: ReactNode | ReactNode[];
  params: Promise<{ locale: TLocale }>;
};

const ShellLayout = (props: TProps) => {
  const { children } = props;

  return (
    <div className={styles.container}>
      {/* Grid overlay — decorative column guides */}
      <div className="fixed left-0 top-0 right-0 bottom-0 pointer-events-none">
        <div className="fixed w-full border-b border-black/5 h-18 sm:h-26 bg-transparent" />
        <Container>
          <div className="h-full grid grid-cols-4">
            <div className="border-r border-l border-black/5" />
            <div className="border-r border-black/5" />
            <div className="border-r border-black/5" />
            <div className="border-r border-black/5" />
          </div>
        </Container>
      </div>

      {/* Replace with your Navbar component */}
      <header />

      <div className={styles.content}>{children}</div>

      {/* Replace with your Footer component */}
      <footer />
    </div>
  );
};

export default ShellLayout;
