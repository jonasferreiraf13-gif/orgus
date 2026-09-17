import { clearAdminSessionCookie } from "@/lib/admin-auth";

export async function GET(request: Request) {
  return new Response(null, {
    status: 303,
    headers: {
      location: new URL("/admin", request.url).toString(),
      "set-cookie": clearAdminSessionCookie(),
      "cache-control": "no-store",
    },
  });
}
