import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** @deprecated use action */
  aside?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  aside,
  action,
  className,
}: PageHeaderProps) {
  const right = action ?? aside;

  return (
    <header
      className={cn(
        "border-b border-border-sutil pb-5",
        right ? "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" : "",
        className
      )}
    >
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] text-[#6B6B6B]">{subtitle}</p>
        )}
      </div>
      {right}
    </header>
  );
}
