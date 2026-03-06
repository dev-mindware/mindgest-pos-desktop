import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { User } from "@/types";
import { SESSION_COOKIE_KEY } from "@/constants";

const secretKey = process.env.SESSION_SECRET || "default_secret";
export const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload extends JWTPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_COOKIE_KEY, session);
    localStorage.setItem(
      `${SESSION_COOKIE_KEY}_expires`,
      expiresAt.toISOString(),
    );
    // For backward compatibility with existing code reading tokens directly
    localStorage.setItem("session-accessToken", payload.accessToken);
    localStorage.setItem("session-refreshToken", payload.refreshToken);
  }
}

export async function destroySession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_COOKIE_KEY);
    localStorage.removeItem(`${SESSION_COOKIE_KEY}_expires`);
    localStorage.removeItem("session-accessToken");
    localStorage.removeItem("session-refreshToken");
  }
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

export async function getSession(): Promise<SessionPayload | null> {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem(SESSION_COOKIE_KEY);
  if (!session) return null;
  return decrypt(session);
}
