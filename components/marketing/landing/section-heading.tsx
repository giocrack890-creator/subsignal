import { FadeIn } from "@/components/marketing/landing/motion";

interface SectionHeadingProps {
  id?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export function SectionHeading({
  id,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <FadeIn className={`max-w-2xl ${alignClass}`}>
      <h2 id={id} className="section-title text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className={`section-subtitle mt-3 ${align === "center" ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
