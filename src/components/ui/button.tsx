import * as React from "react";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 focus-visible:ring-emerald-300",
  outline:
    "border border-emerald-200 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-50 focus-visible:ring-emerald-200",
  ghost:
    "text-emerald-900 hover:bg-emerald-50 focus-visible:ring-emerald-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = "solid",
    size = "md",
    type = "button",
    ...props
  }, ref) => {
    const classes = [
      "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2",
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <button ref={ref} type={type} className={classes} {...props} />;
  }
);

Button.displayName = "Button";
