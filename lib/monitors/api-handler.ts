import { NextResponse } from "next/server";
import { isPlatformNotImplementedError } from "./errors";
import { getMonitor } from "./index";
import { getPlatformMeta } from "./status";
import type { PlatformConfig } from "./types";
import type { Platform } from "@/types";

function authorizeCron(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);
}

function parseSubreddits(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim().replace(/^r\//i, ""))
    .filter(Boolean)
    .slice(0, 10);
}

function buildConfig(
  platform: Platform,
  searchParams: URLSearchParams
): PlatformConfig {
  const maxResults = Number(searchParams.get("maxResults") ?? "10");
  const config: PlatformConfig = {
    maxResults: Number.isFinite(maxResults) ? Math.min(maxResults, 50) : 10,
  };

  if (platform === "reddit") {
    config.subreddits = parseSubreddits(searchParams.get("subreddits"));
  }

  return config;
}

/** Handler compartido para GET /api/monitors/[platform] */
export async function handleMonitorRequest(
  request: Request,
  platform: Platform
): Promise<NextResponse> {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const meta = getPlatformMeta(platform);

  if (meta.status === "coming_soon") {
    return NextResponse.json(
      {
        platform,
        status: meta.status,
        label: meta.label,
        message: meta.implementationNotes,
        blockers: meta.blockers,
        optionsToEvaluate: meta.optionsToEvaluate,
        requiredEnvVars: meta.requiredEnvVars ?? [],
        dataSource: meta.dataSource,
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim();

  if (!keyword) {
    return NextResponse.json(
      { error: "Parámetro requerido: keyword" },
      { status: 400 }
    );
  }

  const monitor = getMonitor(platform);
  const config = buildConfig(platform, searchParams);
  const configError = monitor.validateConfig?.(config);

  if (configError) {
    return NextResponse.json({ error: configError }, { status: 400 });
  }

  try {
    const posts = await monitor.fetchNewPosts(keyword, config);

    return NextResponse.json({
      platform,
      keyword,
      count: posts.length,
      posts,
    });
  } catch (error) {
    if (isPlatformNotImplementedError(error)) {
      return NextResponse.json(
        {
          platform,
          status: "coming_soon",
          message: error.message,
          blockers: error.meta.blockers,
          optionsToEvaluate: error.meta.optionsToEvaluate,
        },
        { status: 503 }
      );
    }

    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
