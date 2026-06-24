"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignalChatPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/signals/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      setAnswer(data.answer ?? data.error ?? "Sin respuesta");
    } catch {
      setAnswer("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border-medio bg-nivel-2 p-4 space-y-3">
      <p className="text-sm font-medium">Chat con tus señales</p>
      <div className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="¿Qué pain points repetidos hay esta semana?"
          onKeyDown={(e) => e.key === "Enter" && void ask()}
        />
        <Button type="button" onClick={() => void ask()} disabled={loading}>
          {loading ? "…" : "Preguntar"}
        </Button>
      </div>
      {answer && (
        <p className="whitespace-pre-wrap text-sm text-foreground-secondary">{answer}</p>
      )}
    </div>
  );
}
