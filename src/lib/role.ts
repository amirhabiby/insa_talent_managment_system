"use server";

import { auth } from "@clerk/nextjs/server";

export async function getUserRole() {
  const { sessionClaims } = await auth();

  // Safely extract role and userId
  const role = (sessionClaims?.metadata as { role?: string })?.role ?? null;
  const userId = sessionClaims?.sub ?? null;
  // console.log(role, userId, "role and userId");
  // console.log(sessionClaims, "sessionClaims");
  return { userId, role };
}
