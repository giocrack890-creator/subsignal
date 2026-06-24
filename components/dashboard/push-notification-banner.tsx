"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

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
    <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-border-sutil bg-nivel-3/80 px-3 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Bell className="h-3.5 w-3.5 shrink-0 text-[#6B6B6B]" aria-hidden="true" />
        <p className="text-[11px] text-[#6B6B6B]">
          Alertas en tiempo real para señales de alta intención
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleEnable}
          className="cursor-pointer rounded-md bg-[rgba(52,211,153,0.12)] px-2 py-1 text-[11px] font-medium text-accent transition-colors hover:bg-[rgba(52,211,153,0.18)]"
        >
          Activar
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[#4B4B4B] transition-colors hover:bg-nivel-4 hover:text-[#B4B4B4]"
          aria-label="Ahora no"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
