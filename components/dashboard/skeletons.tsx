export function SignalCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-background-card p-5">
      <div className="flex justify-between gap-4">
        <div className="h-5 w-16 rounded-full bg-white/10" />
        <div className="h-4 w-20 rounded bg-white/10" />
      </div>
      <div className="mt-4 h-5 w-3/4 rounded bg-white/10" />
      <div className="mt-2 h-4 w-full rounded bg-white/10" />
      <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
      <div className="mt-4 h-1.5 w-32 rounded-full bg-white/10" />
    </div>
  );
}

export function DashboardFeedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <SignalCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton({
  subtitle = true,
}: {
  subtitle?: boolean;
}) {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-40 rounded-lg bg-white/10" />
      {subtitle && <div className="mt-2 h-4 w-64 rounded bg-white/10" />}
    </div>
  );
}

export function StatsCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-border bg-background-card p-5"
        >
          <div className="h-9 w-16 rounded bg-white/10" />
          <div className="mt-3 h-3 w-24 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeaderSkeleton />
      <StatsCardsSkeleton />
      <div className="mt-10 animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-5 w-32 rounded bg-white/10" />
            <div className="mt-2 h-4 w-48 rounded bg-white/10" />
          </div>
          <div className="h-9 w-72 rounded-full bg-white/10" />
        </div>
        <div className="mt-6">
          <DashboardFeedSkeleton />
        </div>
      </div>
    </div>
  );
}

export function KeywordsPageSkeleton() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeaderSkeleton />
      <div className="mt-10 animate-pulse space-y-4">
        <div className="h-5 w-36 rounded bg-white/10" />
        <div className="landing-card h-48 rounded-2xl bg-white/5" />
        <div className="h-5 w-28 rounded bg-white/10" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl border border-border bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DraftCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-background-card">
      <div className="h-28 border-b border-border bg-white/5" />
      <div className="space-y-2 p-5">
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="h-32 rounded-xl bg-white/5" />
      </div>
    </div>
  );
}

export function DraftsPageSkeleton() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeaderSkeleton />
      <div className="mt-8 max-w-3xl space-y-4">
        <DraftCardSkeleton />
        <DraftCardSkeleton />
      </div>
    </div>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeaderSkeleton />
      <StatsCardsSkeleton />
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border border-border bg-white/5" />
        <div className="h-72 animate-pulse rounded-2xl border border-border bg-white/5" />
      </div>
      <div className="mt-4 h-48 animate-pulse rounded-2xl border border-border bg-white/5" />
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeaderSkeleton />
      <div className="mt-8 max-w-2xl space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-border bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}
