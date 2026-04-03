import * as React from "react";

import { toClassName } from "helpers/format";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        autoCapitalize="off"
        type={type}
        className={toClassName(
          "flex w-full border border-black/5 bg-white px-5 py-4 z-10 text-sm sm:text-base xl:text-lg ring-none file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-neutral-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
