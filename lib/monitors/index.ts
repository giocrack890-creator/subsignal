import type { Platform } from "@/types";
import { hackerNewsMonitor } from "./hackernews";
import { indieHackersMonitor } from "./indiehackers";
import { redditMonitor } from "./reddit";
import { twitterMonitor } from "./twitter";
import type { PlatformMonitor } from "./types";

export * from "./types";

const monitors: Record<Platform, PlatformMonitor> = {
  hn: hackerNewsMonitor,
  reddit: redditMonitor,
  twitter: twitterMonitor,
  ih: indieHackersMonitor,
};

export function getMonitor(platform: Platform): PlatformMonitor {
  return monitors[platform];
}

export function getAllMonitors(): PlatformMonitor[] {
  return Object.values(monitors);
}
