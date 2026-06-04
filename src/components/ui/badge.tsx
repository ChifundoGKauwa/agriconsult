import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return <span ref={ref} className={classes} {...props} />;
  }
);

Badge.displayName = "Badge";
