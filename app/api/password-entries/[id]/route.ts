
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//! NEED TO IMPLEMENT AUTHENTICATION WITH JWT SO THE USER CAN ONLY EDIT PASSWORD ENTRY FOR THEMSELVES
/**
 * Handles the HTTP PUT request to update a password entry for a specific user.
 *
 * @param request - The incoming HTTP request containing the updated entry data in JSON format.
 * @param ctx - The context object containing route parameters, specifically the entry `id`.
 * @returns A JSON response with the updated password entry, or an error message with the appropriate HTTP status code.
 *
 * @remarks
 * Authentication with JWT is required to ensure users can only edit password entries for themselves.
 */
export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
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

  const { count } = await prisma.passwordEntry.updateMany({
    where: { id, userId },
    data: { iniVector, cipherData },
  });

  if (count === 0) {
    return NextResponse.json(
      { error: "Forbidden: entry not found for this user" },
      { status: 403 }
    );
  }

  const entry = await prisma.passwordEntry.findUnique({ where: { id } });
  return NextResponse.json(entry);
}

//! NEED TO IMPLEMENT AUTHENTICATION WITH JWT SO THE USER CAN ONLY DELETE PASSWORD ENTRY FOR THEMSELVES
/**
 * Handles the HTTP DELETE request to remove a password entry for a specific user.
 *
 * @param request - The incoming HTTP request containing the `userId` in the JSON body.
 * @param ctx - The context object containing route parameters, specifically the entry `id`.
 * @returns A JSON response indicating success or an error message with the appropriate HTTP status code.
 *
 * @remarks
 * Authentication with JWT is required to ensure users can only delete password entry for themselves.
 */
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { userId } = await request.json();

if (typeof userId !== "string") {
    return NextResponse.json({ error: "userId (string) required" }, { status: 400 });
}

  const { count } = await prisma.passwordEntry.deleteMany({
    where: { id, userId },
  });

  if (count === 0) {
    return NextResponse.json(
      { error: "Forbidden: entry not found for this user" },
      { status: 403 }
    );
  }

  return NextResponse.json({ message: "Entry deleted" }, { status: 200 });
}
