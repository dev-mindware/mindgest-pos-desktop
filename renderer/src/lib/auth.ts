import { cookies } from 'next/headers';
import { decrypt, SessionPayload } from './session';
import { SESSION_COOKIE_KEY } from '@/constants';

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_KEY)?.value;
  if (!sessionCookie) return null;
  return await decrypt(sessionCookie);
}