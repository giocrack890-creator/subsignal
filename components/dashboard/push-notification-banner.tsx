"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const DECLINED_KEY = "push_declined";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (localStorage.getItem(DECLINED_KEY) === "1") return;
    if (Notification.permission !== "default") return;
    setVisible(true);
  }, []);

  async function handleEnable() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        localStorage.setItem(DECLINED_KEY, "1");
        setVisible(false);
        return;
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
      if (!vapidKey) {
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      setVisible(false);
    } catch {
      localStorage.setItem(DECLINED_KEY, "1");
      setVisible(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem(DECLINED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-[#232323] bg-[#111714] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#B4B4B4]">
        🔔 Activá notificaciones para alertas de señales con alta intención en tiempo real.
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="accent" size="sm" onClick={handleEnable}>
          Activar
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleDismiss}>
          Ahora no
        </Button>
      </div>
    </div>
  );
}
