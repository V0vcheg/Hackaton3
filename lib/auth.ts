import prisma from "@/lib/prisma"
import { compare, hash } from "bcryptjs"
import { verifyToken } from "@/utils/totp"

export async function registerUser(email: string, password: string) {
  const hashed = await hash(password, 10)
  return await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  })
}

export async function loginUser(email: string, password: string, otp?: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) throw new Error("Utilisateur introuvable")

  const match = await compare(password, user.password)
  if (!match) throw new Error("Mot de passe incorrect")

  if (user.twoFactor) {
    if (!otp || !user.tfSecret || !verifyToken(otp, user.tfSecret)) {
      throw new Error("Code de vérification invalide")
    }
  }

  return user
}