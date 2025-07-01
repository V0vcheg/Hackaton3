import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

//! NEED TO IMPLEMENT AUTHENTICATION WITH JWT SO THE USER CAN ONLY ACCESS THEIR OWN PROFILE
/**
 * Handles the HTTP GET request to retrieve user profile data.
 *
 * @param request - The incoming HTTP request.
 * @returns A JSON response with the user profile data, or an error message with the appropriate HTTP status code.
 *
 * @remarks
 * Authentication with JWT is required to ensure users can only access their own profile.
 */
export async function GET() {
  try {
    //! TODO: Récupérer l'ID utilisateur depuis le JWT token
    // const userId = extractUserIdFromJWT(request)
    
    // Pour l'instant, on utilise des données vides (en attendant la vraie DB)
    const user = {
      id: "user-id-placeholder",
      firstName: "",
      lastName: "", 
      email: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

//! NEED TO IMPLEMENT AUTHENTICATION WITH JWT SO THE USER CAN ONLY UPDATE THEIR OWN PROFILE
/**
 * Handles the HTTP PUT request to update user profile data.
 *
 * @param request - The incoming HTTP request containing the updated profile data in JSON format.
 * @returns A JSON response with the updated user profile, or an error message with the appropriate HTTP status code.
 *
 * @remarks
 * Authentication with JWT is required to ensure users can only update their own profile.
 */
export async function PUT(request: NextRequest) {
  try {
    const { firstName, lastName, email, newPassword } = await request.json()

    // Validation stricte des paramètres
    if (!firstName || typeof firstName !== "string") {
      return NextResponse.json(
        { error: 'Le prénom est requis et doit être une chaîne de caractères' },
        { status: 400 }
      )
    }

    if (!lastName || typeof lastName !== "string") {
      return NextResponse.json(
        { error: 'Le nom est requis et doit être une chaîne de caractères' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== "string" || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Un email valide est requis' },
        { status: 400 }
      )
    }

    if (newPassword && typeof newPassword !== "string") {
      return NextResponse.json(
        { error: 'Le mot de passe doit être une chaîne de caractères' },
        { status: 400 }
      )
    }

    //! TODO: Intégrer avec la vraie base de données et JWT
    // const userId = extractUserIdFromJWT(request)
    // const existingUser = await prisma.user.findFirst({
    //   where: { email, NOT: { id: userId } }
    // })
    // if (existingUser) {
    //   return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
    // }

    // Pour l'instant, on simule une mise à jour réussie
    const updatedUser = {
      id: "user-id-placeholder",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      updatedAt: new Date()
    }

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

//! NEED TO IMPLEMENT AUTHENTICATION WITH JWT SO THE USER CAN ONLY DELETE THEIR OWN ACCOUNT
/**
 * Handles the HTTP DELETE request to permanently delete a user account.
 *
 * @param request - The incoming HTTP request.
 * @returns A JSON response indicating success or an error message with the appropriate HTTP status code.
 *
 * @remarks
 * Authentication with JWT is required to ensure users can only delete their own account.
 * This action is irreversible and will delete all associated data.
 */
export async function DELETE() {
  try {
    //! TODO: Intégrer avec la vraie base de données et JWT
    // const userId = extractUserIdFromJWT(request)
    
    // Vérifier que l'utilisateur existe
    // const user = await prisma.user.findUnique({ where: { id: userId } })
    // if (!user) {
    //   return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    // }

    // Supprimer d'abord les entrées de mots de passe associées
    // await prisma.passwordEntry.deleteMany({ where: { userId } })
    
    // Puis supprimer l'utilisateur
    // await prisma.user.delete({ where: { id: userId } })

    // Pour l'instant, on simule une suppression réussie
    return NextResponse.json({
      message: 'Compte supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 