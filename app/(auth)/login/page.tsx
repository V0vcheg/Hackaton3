// // import React from "react";

// // export default function LoginPage() {
// //   return (
// //     <main className="flex h-screen bg-background text-foreground">
// //       {/* Partie gauche : formulaire */}
// //       <section className="w-1/2 flex flex-col justify-center items-start p-16 bg-card text-card-foreground">
// //         <h1 className="text-4xl font-bold mb-4">MonSite</h1>
// //         <p className="text-muted-foreground mb-10">Votre espace sécurisé</p>

// //         <form className="w-full max-w-sm">
// //           <label
// //             htmlFor="email"
// //             className="block mb-2 text-muted-foreground font-medium"
// //           >
// //             Email
// //           </label>
// //           <input
// //             type="email"
// //             id="email"
// //             className="w-full mb-6 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //             placeholder="exemple@mail.com"
// //           />

// //           <label
// //             htmlFor="password"
// //             className="block mb-2 text-muted-foreground font-medium"
// //           >
// //             Mot de passe
// //           </label>
// //           <input
// //             type="password"
// //             id="password"
// //             className="w-full mb-6 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //             placeholder="••••••••"
// //           />

// //           <button
// //             type="submit"
// //             className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:brightness-110 transition"
// //           >
// //             Se connecter
// //           </button>
// //         </form>

// //         <p className="mt-6 text-muted-foreground">
// //           Pas encore de compte ?{" "}
// //           <a
// //             href="/auth/register"
// //             className="text-primary font-semibold hover:underline"
// //           >
// //             Inscrivez-vous
// //           </a>
// //         </p>
// //       </section>

// //       {/* Partie droite : logo ou image */}
// //       <section
// //         className="w-1/2 bg-sidebar flex justify-center items-center"
// //         aria-label="Logo"
// //       >
// //         <div className="text-6xl font-extrabold text-sidebar-foreground select-none">
// //           🗂️
// //         </div>
// //       </section>
// //     </main>
// //   );
// // }

// 'use client'

// import React, { useState } from "react"
// import { useRouter } from "next/navigation"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [otp, setOtp] = useState("")
//   const [error, setError] = useState("")
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password, otp }),
//     })

//     const data = await res.json()

//     if (data.success) {
//       // Rediriger vers /auth/profile ou dashboard
//       router.push("/auth/profile")
//     } else {
//       setError(data.message || "Erreur lors de la connexion")
//     }
//   }

//   return (
//     <main className="flex h-screen bg-background text-foreground">
//       {/* Partie gauche : formulaire */}
//       <section className="w-1/2 flex flex-col justify-center items-start p-16 bg-card text-card-foreground">
//         <h1 className="text-4xl font-bold mb-4">MonSite</h1>
//         <p className="text-muted-foreground mb-10">Votre espace sécurisé</p>

//         <form onSubmit={handleSubmit} className="w-full max-w-sm">
//           {error && (
//             <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
//               {error}
//             </div>
//           )}

//           <label
//             htmlFor="email"
//             className="block mb-2 text-muted-foreground font-medium"
//           >
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             className="w-full mb-6 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="exemple@mail.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label
//             htmlFor="password"
//             className="block mb-2 text-muted-foreground font-medium"
//           >
//             Mot de passe
//           </label>
//           <input
//             type="password"
//             id="password"
//             className="w-full mb-6 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="••••••••"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <label
//             htmlFor="otp"
//             className="block mb-2 text-muted-foreground font-medium"
//           >
//             Code de vérification (OTP)
//           </label>
//           <input
//             type="text"
//             id="otp"
//             className="w-full mb-6 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="123456"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />

//           <button
//             type="submit"
//             className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:brightness-110 transition"
//           >
//             Se connecter
//           </button>
//         </form>

//         <p className="mt-6 text-muted-foreground">
//           Pas encore de compte ?{" "}
//           <a
//             href="/auth/register"
//             className="text-primary font-semibold hover:underline"
//           >
//             Inscrivez-vous
//           </a>
//         </p>
//       </section>

//       {/* Partie droite : logo ou image */}
//       <section
//         className="w-1/2 bg-sidebar flex justify-center items-center"
//         aria-label="Logo"
//       >
//         <div className="text-6xl font-extrabold text-sidebar-foreground select-none">
//           🗂️
//         </div>
//       </section>
//     </main>
//   )
// }

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp: twoFactorRequired ? otp : undefined }),
      })

      const data = await res.json()

      if (!data.success) {
        // Si le serveur demande le 2FA, on bascule l'UI
        if (data.twoFactorRequired) {
          setTwoFactorRequired(true)
          setError("")
        } else {
          setError(data.message || "Erreur lors de la connexion.")
        }
        setLoading(false)
        return
      }

      // Connexion réussie => stockage du JWT
      localStorage.setItem("token", data.token)
      router.push("/auth/profile")
    } catch (err) {
      setError("Erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex h-screen bg-background text-foreground">
      <section className="w-1/2 flex flex-col justify-center items-start p-16 bg-card text-card-foreground">
        <h1 className="text-4xl font-bold mb-4">LinkEstiam</h1>
        <p className="text-muted-foreground mb-10">Votre espace sécurisé</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">{error}</div>
          )}

          <label htmlFor="email" className="block mb-2 text-muted-foreground font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-6 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="exemple@mail.com"
            disabled={twoFactorRequired} // Ne plus pouvoir modifier email/password si on attend 2FA
          />

          <label htmlFor="password" className="block mb-2 text-muted-foreground font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            disabled={twoFactorRequired}
          />

          {twoFactorRequired && (
            <>
              <label htmlFor="otp" className="block mb-2 text-muted-foreground font-medium">
                Code de vérification (2FA)
              </label>
              <input
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mb-6 p-3 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="123456"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : twoFactorRequired ? "Valider le code" : "Se connecter"}
          </button>
        </form>

        {!twoFactorRequired && (
          <p className="mt-6 text-muted-foreground">
            Pas encore de compte ?{" "}
            <a href="/auth/register" className="text-primary font-semibold hover:underline">
              Inscrivez-vous
            </a>
          </p>
        )}
      </section>

      <section className="w-1/2 bg-sidebar flex justify-center items-center" aria-label="Logo">
        <div className="text-6xl font-extrabold text-sidebar-foreground select-none">🗂️</div>
      </section>
    </main>
  )
}