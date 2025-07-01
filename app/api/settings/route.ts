import { NextRequest, NextResponse } from 'next/server'

// Pour l'instant, les paramètres sont stockés localement
// Dans une vraie application, ils seraient dans la base de données
export async function GET(request: NextRequest) {
  try {
    // TODO: Récupérer les paramètres depuis la base de données
    const settings = {
      notifications: true,
      darkMode: false,
      language: 'fr',
      theme: 'default'
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notifications, darkMode, language, theme } = body

    // TODO: Sauvegarder les paramètres dans la base de données
    console.log('Paramètres mis à jour:', { notifications, darkMode, language, theme })

    return NextResponse.json({
      message: 'Paramètres mis à jour avec succès',
      settings: { notifications, darkMode, language, theme }
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 