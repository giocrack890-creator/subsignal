import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Contenido alineado a la derecha (contador, badge, etc.) */
  aside?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  aside,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="dash-page-title">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-foreground-secondary">{description}</p>
        )}
      </div>
      {aside}
    </header>
  );
}
