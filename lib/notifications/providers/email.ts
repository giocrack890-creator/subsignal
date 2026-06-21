import type { EmailProvider } from "../types";

/** Proveedor de consola — fallback en dev sin RESEND_API_KEY */
export const consoleEmailProvider: EmailProvider = {
  async send(digest) {
    console.info(
      `[notifications:email:console]\nTo: ${digest.to}\nSubject: ${digest.subject}\n---\n${digest.text}`
    );
  },
};

/** Proveedor Resend — https://resend.com */
export const resendEmailProvider: EmailProvider = {
  async send(digest) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey) {
      throw new Error("Falta RESEND_API_KEY");
    }
    if (!from) {
      throw new Error("Falta EMAIL_FROM (ej: SubSignal <alertas@tudominio.com>)");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [digest.to],
        subject: digest.subject,
        html: digest.html,
        text: digest.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend error ${response.status}: ${body}`);
    }
  },
};

export function getEmailProvider(): EmailProvider {
  if (process.env.RESEND_API_KEY) {
    return resendEmailProvider;
  }
  return consoleEmailProvider;
}

export function isEmailProviderConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}
