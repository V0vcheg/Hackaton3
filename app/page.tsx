'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirection automatique vers le file manager (page principale après auth)
    router.push('/files')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-purple-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Redirection vers LinkESTIAM...</p>
      </div>
    </div>
  )
}
