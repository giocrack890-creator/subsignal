import type { Plan } from "@/types";

export interface NotificationSignal {
  signalId: string;
  title: string | null;
  platform: string;
  score: number;
  excerpt: string;
  draftUrl: string;
  originalUrl: string;
}

export interface NotificationPayload {
  userId: string;
  email: string | null;
  plan: Plan;
  notifyEmail: boolean;
  notifySlack: boolean;
  slackWebhookUrl: string | null;
  signals: NotificationSignal[];
}

export interface NotificationResult {
  emailSent: boolean;
  slackSent: boolean;
  consoleLogged: boolean;
  skippedEmailReason?: string;
}

export interface EmailDigest {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailProvider {
  send(digest: EmailDigest): Promise<void>;
}
