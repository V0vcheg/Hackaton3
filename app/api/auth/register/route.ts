import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    // Vérification basique
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email et mot de passe requis." },
        { status: 400 }
      )
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Un compte avec cet email existe déjà." },
        { status: 400 }
      )
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        // twoFactor: false, // par défaut
        // tfSecret: null
      },
    })

    return NextResponse.json(
      { success: true, message: "Compte créé avec succès.", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error)
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue." },
      { status: 500 }
    )
  }
}