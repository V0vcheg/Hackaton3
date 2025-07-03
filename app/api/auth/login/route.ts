// import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
// import speakeasy from "speakeasy"
// import { cookies } from "next/headers"
// import prisma from "@/lib/prisma"
// import { randomUUID } from "crypto"

// export async function POST(req: Request) {
//   const { email, password, otp } = await req.json()

//   if (!email || !password) {
//     return NextResponse.json({ success: false, message: "Email ou mot de passe manquant." }, { status: 400 })
//   }

//   const user = await prisma.user.findUnique({
//     where: { email },
//   })

//   if (!user || !user.password) {
//     return NextResponse.json({ success: false, message: "Identifiants invalides." }, { status: 401 })
//   }

//   const passwordMatch = await bcrypt.compare(password, user.password)

//   if (!passwordMatch) {
//     return NextResponse.json({ success: false, message: "Mot de passe incorrect." }, { status: 401 })
//   }

//   // Si le 2FA est activé, vérifier le code OTP
//   if (user.twoFactor) {
//     if (!otp || !user.tfSecret) {
//       return NextResponse.json({ success: false, message: "Code de vérification requis." }, { status: 401 })
//     }

//     const isValidOtp = speakeasy.totp.verify({
//       secret: user.tfSecret,
//       encoding: "base32",
//       token: otp,
//       window: 1,
//     })

//     if (!isValidOtp) {
//       return NextResponse.json({ success: false, message: "Code OTP invalide." }, { status: 401 })
//     }
//   }

//   // Créer un token de session
//   const sessionToken = randomUUID()
//   const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 jours

//   await prisma.session.create({
//     data: {
//       userId: user.id,
//       sessionToken,
//       expires,
//     },
//   })

//   // Stocker la session dans un cookie sécurisé
//   cookies().set("session-token", sessionToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     expires,
//   })

//   return NextResponse.json({ success: true, message: "Connexion réussie." })
// }


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

  // Si 2FA activé, vérifier OTP
  if (user.twoFactor) {
    if (!otp || !user.tfSecret) {
      return NextResponse.json({ success: false, message: "Code de vérification requis." }, { status: 401 })
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

  // Renvoie le token au client
  return NextResponse.json({
    success: true,
    message: "Connexion réussie.",
    token,
  })
}