import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "rounded-2xl border border-emerald-100 bg-white shadow-sm",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => {
    const classes = ["p-6 pb-3", className].filter(Boolean).join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);

CardHeader.displayName = "CardHeader";

export const CardContent = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => {
    const classes = ["p-6 pt-0", className].filter(Boolean).join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);

CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => {
    const classes = ["p-6 pt-0", className].filter(Boolean).join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);

CardFooter.displayName = "CardFooter";

export const CardTitle = React.forwardRef<HTMLHeadingElement, DivProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "text-lg font-semibold text-emerald-950",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return <h3 ref={ref} className={classes} {...props} />;
  }
);

CardTitle.displayName = "CardTitle";
