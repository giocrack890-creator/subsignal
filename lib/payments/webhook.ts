/** Webhook handler genérico — conectar proveedor en PASO 8 */

export async function handlePaymentWebhook(
  body: unknown,
  signature: string | null
): Promise<{ plan: string; customerId: string }> {
  void body;
  void signature;
  throw new Error("Payment webhook no implementado — PASO 8");
}
