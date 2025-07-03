'use client'

import { useEffect, useCallback, useState } from 'react'

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean
  onSave: () => Promise<void> | void
  message?: string
}

export function useUnsavedChanges({ hasUnsavedChanges, onSave, message }: UseUnsavedChangesOptions) {
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault()
      e.returnValue = message || 'Vous avez des modifications non sauvegardées'
      return message || 'Vous avez des modifications non sauvegardées'
    }
  }, [hasUnsavedChanges, message])

  // Fonction pour vérifier les modifications (appelée par la sidebar)
  const checkUnsavedChanges = useCallback(async (): Promise<boolean> => {
    if (hasUnsavedChanges) {
      return new Promise((resolve) => {
        setPendingNavigation(() => () => resolve(true))
        setShowModal(true)
      })
    }
    return true
  }, [hasUnsavedChanges])

  const handleSaveAndContinue = useCallback(async () => {
    try {
      setSaving(true)
      await onSave()
      setShowModal(false)
      if (pendingNavigation) {
        setTimeout(() => {
          pendingNavigation()
          setPendingNavigation(null)
        }, 100)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setSaving(false)
    }
  }, [onSave, pendingNavigation])

  const handleDiscardAndContinue = useCallback(() => {
    setShowModal(false)
    if (pendingNavigation) {
      setTimeout(() => {
        pendingNavigation()
        setPendingNavigation(null)
      }, 100)
    }
  }, [pendingNavigation])

  const handleCancel = useCallback(() => {
    setShowModal(false)
    setPendingNavigation(null)
  }, [])

  // Enregistrer la fonction globalement
  useEffect(() => {
    window.checkUnsavedChanges = checkUnsavedChanges
    
    return () => {
      window.checkUnsavedChanges = undefined
    }
  }, [checkUnsavedChanges])

  // Protection fermeture de page/onglet
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleBeforeUnload])

  return {
    showModal,
    saving,
    handleSaveAndContinue,
    handleDiscardAndContinue,
    handleCancel
  }
} 