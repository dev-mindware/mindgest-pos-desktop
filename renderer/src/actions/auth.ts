"use server";
import { getSession } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function   reauthenticate() {
  const session = await getSession();
  const refreshToken = session?.refreshToken;
  
  if (!refreshToken) {
    throw new Error("Refresh token não encontrado");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error("Falha ao renovar o token");
  }

  const newTokens = await response.json();
  const newAccessToken = newTokens.accessToken;
  const newRefreshToken = newTokens.refreshToken;

  await createSession({
    user: session.user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
}