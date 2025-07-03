'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TwoFAVerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') || ''

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token: code }),
    })

    const data = await res.json()
    setLoading(false)

    if (!data.success) {
      setError(data.message || 'Code invalide')
      return
    }

    // 2FA validé → redirection vers profile ou dashboard
    // stocker sessionToken si fourni
    if (data.sessionToken) {
      localStorage.setItem('sessionToken', data.sessionToken)
    }

    router.push('/profile')
  }

  if (!userId) {
    return (
      <main className="flex h-screen items-center justify-center bg-background text-foreground">
        <p className="text-red-600">User ID manquant dans l’URL.</p>
      </main>
    )
  }

  return (
    <main className="flex h-screen bg-background text-foreground">
      <section className="m-auto w-full max-w-sm p-8 bg-card rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6">Vérification à deux facteurs</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="code" className="block mb-2 text-muted-foreground font-medium">
            Code 2FA
          </label>
          <input
            id="code"
            type="text"
            required
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full mb-4 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Entrez votre code"
            maxLength={6}
            pattern="\d{6}"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:brightness-110 transition"
          >
            {loading ? 'Vérification...' : 'Valider'}
          </button>
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </form>
      </section>
    </main>
  )
}