import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { User } from "@/types";
import { SESSION_COOKIE_KEY } from "@/constants";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}

const HOURS = 24;
export const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload extends JWTPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + HOURS * 60 * 60 * 1000);
  // const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);

  const authCookies = await cookies();
  authCookies.set(SESSION_COOKIE_KEY, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function destroySession() {
  const authCookies = await cookies();
  authCookies.delete("session");
}

export async function decrypt(session: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("Falha ao decifrar sessão:", error);
    return null;
  }
}
