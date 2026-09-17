import {
  adminSessionCookie,
  authenticateAdmin,
  createAdminSessionToken,
  isAdminPasswordConfigured,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return redirectTo(request, "/admin?erro=configuracao");
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!(await authenticateAdmin(email, password))) {
    return redirectTo(request, "/admin?erro=credenciais");
  }

  const token = await createAdminSessionToken();
  return new Response(null, {
    status: 303,
    headers: {
      location: new URL("/admin", request.url).toString(),
      "set-cookie": adminSessionCookie(token),
      "cache-control": "no-store",
    },
  });
}

function redirectTo(request: Request, path: string) {
  return new Response(null, {
    status: 303,
    headers: {
      location: new URL(path, request.url).toString(),
      "cache-control": "no-store",
    },
  });
}
