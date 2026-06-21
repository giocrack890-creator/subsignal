import { handleMonitorRequest } from "@/lib/monitors/api-handler";

export async function GET(request: Request) {
  return handleMonitorRequest(request, "ih");
}
