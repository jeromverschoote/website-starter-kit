'use client';

import { createContext, FC, ReactNode, useContext, useState } from 'react';

import Image from 'next/image';

import Icon from '@repo/ui/icon';

import { toClassName } from 'helpers/format';

import { useKeyPress } from 'hooks/use-key-press';

import { styles } from '.';

type TContext = {
  setPictures: (
    pictures: {
      asset: {
        url: string;
      };
    }[],
  ) => void;

  selector: number | null;
  setSelector: (selector: number | null) => void;
  setIsShown: (isShown: boolean) => void;
};

type TProps = {
  children: ReactNode | ReactNode[];
};

const Context = createContext<TContext>({
  setPictures: () => null,

  selector: null,
  setSelector: () => null,
  setIsShown: () => null,
});

const PictureViewerProvider: FC<TProps> = (props) => {
  const { children } = props;

  const [pictures, setPictures] = useState<
    {
      asset: {
        url: string;
      };
    }[]
  >([]);
  const [selector, setSelector] = useState<number | null>(null);
  const [isShown, setIsShown] = useState(false);

  useKeyPress('ArrowLeft', () => {
    if (selector === null) {
      return;
    }

    if (selector === 0) {
      return;
    }

    setSelector(selector - 1);
  });

  useKeyPress('ArrowRight', () => {
    if (selector === null) {
      return;
    }

    if (selector === pictures.length - 1) {
      return;
    }

    setSelector(selector + 1);
  });

  useKeyPress('Escape', () => {
    if (isShown === false) {
      return;
    }

    setIsShown(false);
  });

  return (
    <Context.Provider
      value={{
        setPictures,

        selector,
        setSelector,

        setIsShown,
      }}
    >
      {children}

      <div className="relative duration-300">
        <div
          className={toClassName(
            styles.viewer.container,
            isShown
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
        >
          <div className={styles.viewer.content}>
            {pictures[selector as number]?.asset?.url && (
              <Image
                src={pictures[selector as number]?.asset?.url as string}
                alt=""
                layout="fill"
                objectFit="contain"
                className="pointer-events-none translate-y-10 sm:translate-y-0"
              />
            )}

            <div className={styles.viewer.navigation.container}>
              <div className={styles.viewer.navigation.head}>
                  <button
                  aria-label="close"
                  className={styles.viewer.button}
                  onClick={() => {
                    setIsShown(false);
                  }}
                >
                  <Icon accessor="xmark" />
                </button>
              </div>
              <div className={styles.viewer.navigation.body}>
                <button
                  aria-label="previous"
                  className={toClassName(
                    styles.viewer.button,
                    selector === 0 && 'opacity-20',
                  )}
                  disabled={selector === 0}
                  onClick={() => setSelector((selector as number) - 1)}
                >
                  <Icon accessor="chevron-left" />
                </button>
                <button
                  aria-label="next"
                  className={toClassName(
                    styles.viewer.button,
                    selector === pictures.length - 1 && 'opacity-20',
                  )}
                  disabled={selector === pictures.length - 1}
                  onClick={() => setSelector((selector as number) + 1)}
                >
                  <Icon accessor="chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Context.Provider>
  );
};

export const usePictureViewerContext = () => useContext(Context);

export default PictureViewerProvider;
