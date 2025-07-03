import {NextRequest, NextResponse} from 'next/server'
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

// import { prisma } from '@/lib/prisma'

function extractUserIdFromJWT(request: NextRequest): string | null {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    const decoded = jwt.decode(token, {complete: true}) as { payload: { userId: string } } | null;
    return decoded?.payload.userId || null;
}

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
export async function GET(request: NextRequest) {
    try {
        //! TODO: Récupérer l'ID utilisateur depuis le JWT token
        // const userId = extractUserIdFromJWT(request)
        const userId = extractUserIdFromJWT(request)
        if (!userId) {
            return NextResponse.json(
                {error: 'Utilisateur non authentifié'},
                {status: 401}
            )
        }
        // Pour l'instant, on utilise des données vides (en attendant la vraie DB)
        const user = await prisma.user.findUnique({where: {id: userId}})
        /*const user = {
          id: "user-id-placeholder",
          firstName: "",
          lastName: "",
          email: "",
          createdAt: new Date(),
          updatedAt: new Date()
        }*/

        return NextResponse.json(user)
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
        return NextResponse.json(
            {error: 'Erreur interne du serveur'},
            {status: 500}
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
        const {firstName, lastName, email, newPassword} = await request.json()

        // Validation stricte des paramètres
        if (!firstName || typeof firstName !== "string") {
            return NextResponse.json(
                {error: 'Le prénom est requis et doit être une chaîne de caractères'},
                {status: 400}
            )
        }

        if (!lastName || typeof lastName !== "string") {
            return NextResponse.json(
                {error: 'Le nom est requis et doit être une chaîne de caractères'},
                {status: 400}
            )
        }

        if (!email || typeof email !== "string" || !email.includes('@')) {
            return NextResponse.json(
                {error: 'Un email valide est requis'},
                {status: 400}
            )
        }

        if (newPassword && typeof newPassword !== "string") {
            return NextResponse.json(
                {error: 'Le mot de passe doit être une chaîne de caractères'},
                {status: 400}
            )
        }
        const userId = extractUserIdFromJWT(request)
        if (!userId) {
            return NextResponse.json(
                {error: 'Utilisateur non authentifié'},
                {status: 401}
            )
        }
        const existingUser = await prisma.user.findUnique({
            where: {email: email.toLowerCase().trim()}
        })
        if (existingUser && existingUser.id !== userId) {
            return NextResponse.json({error: 'Cet email est déjà utilisé'}, {status: 409})
        }

        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                ...(newPassword && {password: newPassword}) // Mettre à jour le mot de passe uniquement s'il est fourni
            }
        })


        return NextResponse.json({
            message: 'Profil mis à jour avec succès',
            user: updatedUser
        })
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error)
        return NextResponse.json(
            {error: 'Erreur interne du serveur'},
            {status: 500}
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
export async function DELETE(request: NextRequest) {
    try {
        //! TODO: Intégrer avec la vraie base de données et JWT
        // const userId = extractUserIdFromJWT(request)
        const userId = extractUserIdFromJWT(request)
        if (!userId) {
            return NextResponse.json(
                {error: 'Utilisateur non authentifié'},
                {status: 401}
            )
        }
        // Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({where: {id: userId}})
        if (!user) {
            return NextResponse.json({error: 'Utilisateur non trouvé'}, {status: 404})
        }

        await prisma.passwordEntry.deleteMany({where: {id: userId}})

        await prisma.user.delete({where: {id: userId}})

        //clear cookies if needed
        request.cookies.delete('token')

        // Pour l'instant, on simule une suppression réussie
        return NextResponse.json({
            message: 'Compte supprimé avec succès'
        })
    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error)
        return NextResponse.json(
            {error: 'Erreur interne du serveur'},
            {status: 500}
        )
    }
} 