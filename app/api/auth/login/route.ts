// In your route.ts file - replace the return statement with this:

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import speakeasy from "speakeasy"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET"


export async function POST(req: Request) {
  const { email, password, otp } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Email ou mot de passe manquant." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.password) {
    return NextResponse.json({ success: false, message: "Identifiants invalides." }, { status: 401 })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return NextResponse.json({ success: false, message: "Mot de passe incorrect." }, { status: 401 })
  }

  // Si 2FA activé mais pas d'OTP fourni, demander le code
  if (user.twoFactor && !otp) {
    return NextResponse.json({
      success: false,
      message: "Code de vérification requis.",
      twoFactorRequired: true
    }, { status: 401 })
  }

  // Si 2FA activé et OTP fourni, vérifier le code
  if (user.twoFactor && otp) {
    if (!user.tfSecret) {
      return NextResponse.json({ success: false, message: "2FA mal configuré." }, { status: 500 })
    }

    const isValidOtp = speakeasy.totp.verify({
      secret: user.tfSecret,
      encoding: "base32",
      token: otp,
      window: 1,
    })

    if (!isValidOtp) {
      return NextResponse.json({ success: false, message: "Code OTP invalide." }, { status: 401 })
    }
  }

  // Générer un JWT (ex : valable 7 jours)
  const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
  )

  // Créer la réponse avec le cookie
  const response = NextResponse.json({
    success: true,
    message: "Connexion réussie.",
    // Optionally still return the token for client-side use
    token,
  })

  // Définir le cookie avec le token
  response.cookies.set("token", token, {
    httpOnly: true,           // Cookie accessible uniquement côté serveur
    secure: process.env.NODE_ENV === "production", // HTTPS uniquement en production
    sameSite: "lax",          // Protection CSRF
    path: "/",                // Disponible sur tout le site
    maxAge: 60 * 60 * 24 * 7, // 7 jours en secondes
  })

  return response
}