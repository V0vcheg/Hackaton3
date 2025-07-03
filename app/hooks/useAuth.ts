"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "CHANGE_THIS_SECRET"

export default function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    try {
      jwt.verify(token, JWT_SECRET)
      // Token valide, on reste sur la page
    } catch {
      // Token invalide ou expiré
      localStorage.removeItem("token")
      router.push("/auth/login")
    }
  }, [router])
}