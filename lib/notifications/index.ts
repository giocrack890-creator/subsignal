/** Interfaz de notificaciones desacoplada — implementación en PASO 7 */

export interface NotificationPayload {
  userId: string;
  email: string;
  signals: Array<{
    title: string | null;
    platform: string;
    score: number;
    excerpt: string;
    draftUrl: string;
    originalUrl: string;
  }>;
}

export async function sendNotification(
  payload: NotificationPayload
): Promise<void> {
  void payload;
  // Proveedor de email/Slack pendiente de definir
  console.info("[notifications] sendNotification — stub, PASO 7");
}
