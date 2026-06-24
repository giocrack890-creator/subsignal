import type { Platform } from "@/types";
import { hackerNewsMonitor } from "./hackernews";
import { indieHackersMonitor } from "./indiehackers";
import { redditMonitor } from "./reddit";
import { PLATFORM_META } from "./status";
import { twitterMonitor } from "./twitter";
import type { PlatformMeta, PlatformMonitor } from "./types";

export * from "./types";
export { PLATFORM_META, getComingSoonPlatforms, getPlatformMeta } from "./status";
export {
  PlatformNotImplementedError,
  isPlatformNotImplementedError,
} from "./errors";

type MonitoredPlatform = "hn" | "reddit" | "twitter" | "ih";

const monitors: Record<MonitoredPlatform, PlatformMonitor> = {
  hn: hackerNewsMonitor,
  reddit: redditMonitor,
  twitter: twitterMonitor,
  ih: indieHackersMonitor,
};

export function getMonitor(platform: Platform): PlatformMonitor {
  if (!(platform in monitors)) {
    throw new Error(`No hay monitor nativo para ${platform}; usa feature_sources`);
  }
  return monitors[platform as MonitoredPlatform];
}

export function getAllMonitors(): PlatformMonitor[] {
  return Object.values(monitors);
}

export function getActiveMonitors(): PlatformMonitor[] {
  return getAllMonitors().filter((m) => m.meta.status === "active");
}

export function getMonitorRegistry(): Partial<Record<Platform, PlatformMeta>> {
  return PLATFORM_META;
}
