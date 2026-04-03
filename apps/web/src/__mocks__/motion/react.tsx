import React from 'react';

const ANIMATION_PROPS = new Set([
  'initial',
  'animate',
  'exit',
  'variants',
  'transition',
  'whileHover',
  'whileTap',
  'whileInView',
  'viewport',
  'layoutId',
  'layout',
  'onAnimationStart',
  'onAnimationComplete',
  'drag',
  'dragConstraints',
  'dragElastic',
]);

const createMotionComponent = (tag: string) =>
  React.forwardRef(({ children, ...props }: any, ref: any) => {
    const filtered = Object.fromEntries(
      Object.entries(props).filter(([k]) => !ANIMATION_PROPS.has(k)),
    );
    return React.createElement(tag, { ...filtered, ref }, children);
  });

export const motion = new Proxy({} as Record<string, any>, {
  get: (_, prop: string) => createMotionComponent(prop),
});

export const AnimatePresence = ({ children }: any) => children;

export const useMotionValue = (initial: any) => {
  let value = initial;
  return {
    get: () => value,
    set: (v: any) => {
      value = v;
    },
  };
};

export const useSpring = (value: any) => value;
export const useMotionTemplate = () => '';
export const useTransform = () => ({ get: () => 0 });
export const useReducedMotion = () => false;

export type Variants = Record<string, any>;
export type Transition = Record<string, any>;
