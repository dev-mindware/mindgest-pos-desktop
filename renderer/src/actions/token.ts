"use server";

import { getSession } from "@/lib/auth";

export async function getAccessToken() {
  const session = await getSession();
  return session?.accessToken || null;
}