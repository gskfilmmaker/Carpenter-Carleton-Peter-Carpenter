import type { ReactNode } from "react";
import clsx from "clsx";
import { Container } from "@/components/layout/Container";

export function Section({
  children,
  className,
  containerClassName,
  as: As = "section",
  id,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div";
  id?: string;
}) {
  return (
    <As id={id} className={clsx("py-16 sm:py-20 lg:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </As>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-sage">
      <span aria-hidden className="inline-block h-px w-6 bg-copper" />
      {children}
    </p>
  );
}
