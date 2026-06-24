"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <section className="relative py-32 sm:py-40">
      <div className="absolute inset-0 fx-radial-glow opacity-60" aria-hidden="true" />
      <div className="container-marketing relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="section-title text-glow">
          Tu próximo cliente ya está preguntando
        </h2>
        <p className="mt-4 text-foreground-secondary">
          Plan free · Sin tarjeta · Login con Google
        </p>
        <Link href="/login" className="mt-10 inline-block cursor-pointer">
          <Button variant="primary" size="lg" showArrow>
            Empezar gratis
          </Button>
        </Link>
      </div>
    </section>
  );
}
