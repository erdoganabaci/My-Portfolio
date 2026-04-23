import type {PropsWithChildren} from "react";

type SectionShellProps = PropsWithChildren<{
  className?: string;
  id?: string;
}>;

export function SectionShell({
  children,
  className = "",
  id
}: SectionShellProps) {
  return (
    <section className={`scroll-mt-28 py-10 sm:py-14 ${className}`.trim()} id={id}>
      {children}
    </section>
  );
}
