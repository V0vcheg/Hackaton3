'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      alert("Inscription réussie ! Vous pouvez vous connecter.")
      router.push("/auth/login")
    } else {
      alert(data.message)
    }
  }

  return (
    <main className="flex h-screen bg-background text-foreground">
      <section className="w-1/2 flex flex-col justify-center items-start p-16 bg-card text-card-foreground">
        <h1 className="text-4xl font-bold mb-4">Inscription</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <input
            name="name"
            type="text"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-input border border-border"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-input border border-border"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-input border border-border"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-primary text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Chargement..." : "S’inscrire"}
          </button>
        </form>
        <p className="mt-6 text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <a href="/auth/login" className="text-primary font-semibold hover:underline">
            Connectez-vous
          </a>
        </p>
      </section>
      <section className="w-1/2 bg-sidebar flex justify-center items-center">
        <div className="text-6xl font-extrabold text-sidebar-foreground select-none">
          🛡️
        </div>
      </section>
    </main>
  )
}