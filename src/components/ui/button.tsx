import type {ButtonHTMLAttributes, PropsWithChildren} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = PropsWithChildren<{
  className?: string;
  href?: string;
  newTab?: boolean;
  variant?: ButtonVariant;
}> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

const variantClassNames: Record<ButtonVariant, string> = {
  ghost:
    "border-transparent bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white",
  primary:
    "border-emerald-800 bg-emerald-900 text-white shadow-[0_16px_40px_-24px_rgba(6,78,59,0.9)] hover:-translate-y-0.5 hover:bg-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200",
  secondary:
    "border-slate-300 bg-white/70 text-slate-900 hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
};

export function Button({
  children,
  className = "",
  href,
  newTab = false,
  type = "button",
  variant = "primary",
  ...buttonProps
}: ButtonProps) {
  const resolvedClassName =
    `${baseClassName} ${variantClassNames[variant]} ${className}`.trim();

  if (href) {
    return (
      <a
        className={resolvedClassName}
        href={href}
        rel={newTab ? "noreferrer" : undefined}
        target={newTab ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={resolvedClassName} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
