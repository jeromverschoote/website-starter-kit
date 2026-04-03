import React from 'react';

const Link = ({
  href,
  children,
  ...props
}: {
  href: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}) => (
  <a href={href} {...(props as React.HTMLAttributes<HTMLAnchorElement>)}>
    {children}
  </a>
);

export default Link;
