import * as React from "react";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => {
    const classes = ["mx-auto w-full max-w-6xl px-6", className]
      .filter(Boolean)
      .join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);

Container.displayName = "Container";
