const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export async function requireAdminRequest(request) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new Error("Admin authorization is required.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
    headers: {
      Authorization: authorization,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Admin authorization failed.");
  }
}
