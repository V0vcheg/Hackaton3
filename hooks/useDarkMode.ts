'use client'

import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Charger la préférence sauvegardée
    const savedMode = localStorage.getItem('linkestiam-dark-mode')
    if (savedMode !== null) {
      const darkMode = JSON.parse(savedMode)
      setIsDarkMode(darkMode)
      applyDarkMode(darkMode)
    } else {
      // Utiliser la préférence système par défaut
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(systemPrefersDark)
      applyDarkMode(systemPrefersDark)
    }
  }, [])

  const applyDarkMode = (darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled)
    localStorage.setItem('linkestiam-dark-mode', JSON.stringify(enabled))
    applyDarkMode(enabled)
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
} 