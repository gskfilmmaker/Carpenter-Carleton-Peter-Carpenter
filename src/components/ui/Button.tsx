import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "tertiary";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink text-white shadow-[0_1px_0_rgba(16,42,67,0.2)] hover:-translate-y-px hover:shadow-[0_6px_18px_-6px_rgba(16,42,67,0.45)]",
  secondary:
    "bg-transparent text-ink border border-line hover:border-ink hover:bg-surface",
  tertiary: "bg-transparent text-ink-soft underline underline-offset-4 hover:text-ink",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[0.95rem] font-semibold transition-[transform,box-shadow,background,color] duration-200 ease-out";

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={clsx(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: {
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}
