import { ReactNode } from "react";

import { default as Component, LinkProps } from "next/link";

import { styles } from ".";
import Icon from "../icon";

type TProps = LinkProps & {
  children: ReactNode;

  className?: string;
  rel?: string;

  isExternal?: boolean;
  iconSize?: string;
};

const Link = (props: TProps) => {
  const { isExternal, iconSize } = props;

  return (
    <div className={styles.container}>
      <Component {...props} target={isExternal ? "_blank" : ""} />
      {isExternal && <Icon accessor="arrow-up-right" size={iconSize} />}
    </div>
  );
};

export default Link;
