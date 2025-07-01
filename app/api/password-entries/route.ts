import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//! NEED TO IMPLEMENT AUTHENTICATION WITH JWT SO THE USER CAN ONLY CREATE PASSWORD ENTRIES FOR THEMSELVES
/**
 * Handles GET requests to retrieve password entries for a specific user.
 *
 * @param request - The incoming HTTP request object.
 * @returns A JSON response containing the user's password entries, ordered by creation date (descending),
 *          or an error message if the `userId` query parameter is missing or invalid.
 *
 * @remarks
 * Authentication with JWT is required to ensure users can only access their own password entries.
 *
 * @example
 * // GET /api/password-entries?userId=1
 * // Returns: [{...}, {...}]
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");

  const userId = Number(userIdParam);
  if (!userIdParam || Number.isNaN(userId)) {
    return NextResponse.json(
      { error: "userId query param required (e.g. ?userId=1)" },
      { status: 400 }
    );
  }

  const entries = await prisma.passwordEntry.findMany({
    where: { userId: userIdParam as string },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries);
}

//! NEED TO IMPLEMENT AUTHENTICATION WITH JWT SO THE USER CAN ONLY CREATE PASSWORD ENTRY FOR THEMSELVES
/**
 * Handles POST requests to create a new password entry for a user.
 *
 * @param request - The incoming HTTP request object containing JSON with `userId`, `iniVector`, and `cipherData`.
 * @returns A JSON response containing the created password entry, or an error message if required fields are missing.
 *
 * @remarks
 * Authentication with JWT is required to ensure users can only create password entries for themselves.
 *
 * @example
 * // POST /api/password-entries
 * // Body: { "userId": "1", "iniVector": "...", "cipherData": "..." }
 * // Returns: { ... }
 */
export async function POST(request: Request) {
  const { userId, iniVector, cipherData } = await request.json();

  if (
    !userId ||
    typeof userId !== "string" ||
    !iniVector ||
    typeof iniVector !== "string" ||
    !cipherData ||
    typeof cipherData !== "string"
  ) {
    return NextResponse.json(
      {
        error:
          "userId (string), iniVector (string) & cipherData (string) required",
      },
      { status: 400 }
    );
  }

  const entry = await prisma.passwordEntry.create({
    data: { userId, iniVector, cipherData },
  });

  return NextResponse.json(entry, { status: 201 });
}
