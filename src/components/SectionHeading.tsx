import type { ReactNode } from "react";

export default function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`section-tab font-display lowercase ${className}`.trim()}
    >
      {children}
    </h2>
  );
}
