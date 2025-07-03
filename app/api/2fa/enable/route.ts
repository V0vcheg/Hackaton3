import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import speakeasy from "speakeasy"
import QRCode from "qrcode"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ success: false, message: "userId requis." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 })
  }

  const secret = speakeasy.generateSecret({
    name: `MonSite (${user.email})`,
  })

  // Génère QR code en dataURL
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

  // Stocke secret temporairement (à activer à la validation du code)
  await prisma.user.update({
    where: { id: userId },
    data: { tfSecret: secret.base32 },
  })

  return NextResponse.json({ success: true, qrCodeUrl, secret: secret.base32 })
}