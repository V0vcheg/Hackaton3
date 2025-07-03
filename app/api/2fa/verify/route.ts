import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import speakeasy from 'speakeasy'

export async function POST(req: Request) {
  try {
    const { userId, token } = await req.json()

    if (!userId || !token) {
      return NextResponse.json({ success: false, message: 'Paramètres manquants.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.twoFactor || !user.tfSecret) {
      return NextResponse.json({ success: false, message: 'Utilisateur non trouvé ou 2FA non activé.' }, { status: 404 })
    }

    const verified = speakeasy.totp.verify({
      secret: user.tfSecret,
      encoding: 'base32',
      token,
      window: 1, // tolérance 1 intervalle (30s)
    })

    if (!verified) {
      return NextResponse.json({ success: false, message: 'Code 2FA invalide.' }, { status: 401 })
    }

    // 2FA valide → créer une session
    const sessionToken = crypto.randomUUID()

    await prisma.session.create({
      data: {
        id: sessionToken,
        sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // expire dans 7 jours
      },
    })

    return NextResponse.json({ success: true, sessionToken })
  } catch (error) {
    console.error('2FA verify error:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 })
  }
}