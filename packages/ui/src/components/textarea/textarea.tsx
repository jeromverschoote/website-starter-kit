import * as React from "react";

import { toClassName } from "helpers/format";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={toClassName(
        "flex w-full min-h-[240px] border border-black/5 bg-white z-10 px-5 py-4 text-sm sm:text-base xl:text-lg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
