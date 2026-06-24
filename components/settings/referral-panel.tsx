"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ReferralPanel() {
  const [code, setCode] = useState("");
  const [link, setLink] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    void fetch("/api/referral")
      .then((r) => r.json())
      .then((data: { code?: string; link?: string; referrals?: number }) => {
        if (data.code) setCode(data.code);
        if (data.link) setLink(data.link);
        setCount(data.referrals ?? 0);
      });
  }, []);

  function copyLink() {
    void navigator.clipboard.writeText(link);
  }

  return (
    <div className="rounded-xl border border-border-medio bg-nivel-2 p-4 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Programa de referidos</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          1 mes Pro por cada founder que se registre con tu link
        </p>
      </div>
      <p className="text-sm">
        Referidos: <strong>{count}</strong> · Código: <strong>{code}</strong>
      </p>
      <div>
        <Label>Tu link</Label>
        <div className="mt-1 flex gap-2">
          <Input value={link} readOnly />
          <Button type="button" size="sm" variant="outline" onClick={copyLink}>
            Copiar
          </Button>
        </div>
      </div>
    </div>
  );
}
