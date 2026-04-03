import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import { toClassName } from "helpers/format";

import { styles } from ".";

export type TRichText = TypedObject | TypedObject[];

type TProps = {
  value: TRichText;
  //
  className?: string;
  //
  hasStyling?: boolean;
};

const RichText = (props: TProps) => {
  const { value, className, hasStyling = true } = props;

  return (
    <div className={toClassName(hasStyling && styles.container, className)}>
      <PortableText value={value} />
    </div>
  );
};

export { RichText };
