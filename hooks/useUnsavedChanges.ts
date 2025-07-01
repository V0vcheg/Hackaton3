'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean
  onSave: () => Promise<void> | void
  message?: string
}

export function useUnsavedChanges({ hasUnsavedChanges, onSave, message }: UseUnsavedChangesOptions) {
  const router = useRouter()
  const pathname = usePathname()
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

  const handleNavigationAttempt = useCallback((navigationFn: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => navigationFn)
      setShowModal(true)
      return false
    }
    navigationFn()
    return true
  }, [hasUnsavedChanges])

  const handleSaveAndContinue = useCallback(async () => {
    try {
      setSaving(true)
      await onSave()
      setShowModal(false)
      if (pendingNavigation) {
        pendingNavigation()
        setPendingNavigation(null)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setSaving(false)
    }
  }, [onSave, pendingNavigation])

  const handleDiscardAndContinue = useCallback(() => {
    setShowModal(false)
    // Utiliser setTimeout pour s'assurer que la modal se ferme avant la navigation
    setTimeout(() => {
      if (pendingNavigation) {
        pendingNavigation()
        setPendingNavigation(null)
      }
    }, 100)
  }, [pendingNavigation])

  const handleCancel = useCallback(() => {
    setShowModal(false)
    setPendingNavigation(null)
  }, [])

  useEffect(() => {
    // Protection fermeture de page/onglet
    window.addEventListener('beforeunload', handleBeforeUnload)

         // Protection navigation par liens
     const handleClick = (e: Event) => {
       const target = e.target as HTMLElement
       const link = target.closest('a')
       
       if (link && hasUnsavedChanges) {
         const href = link.getAttribute('href')
         if (href && href !== pathname && (href.startsWith('/') || href.startsWith('#'))) {
           e.preventDefault()
           e.stopPropagation()
           handleNavigationAttempt(() => {
             window.location.href = href
           })
           return false
         }
       }
     }

     // Protection navigation par boutons (uniquement pour navigation externe)
     const handleButtonClick = (e: Event) => {
       const target = e.target as HTMLElement
       const button = target.closest('button')
       
       if (button && hasUnsavedChanges) {
         // Vérifier si c'est un bouton de navigation externe (ProfileButton)
         const isExternalNavigationButton = button.className.includes('profile-button') ||
                                           button.getAttribute('data-navigation') === 'true'
         
         // Exclure les boutons internes de changement d'onglet
         const isInternalTabButton = button.textContent?.includes('Profil') ||
                                   button.textContent?.includes('Profile') ||
                                   button.textContent?.includes('Settings') ||
                                   button.textContent?.includes('Paramètres')
         
         if (isExternalNavigationButton && !isInternalTabButton) {
           e.preventDefault()
           e.stopPropagation()
           // Pour ProfileButton, naviguer vers /profile
           handleNavigationAttempt(() => {
             window.location.href = '/profile'
           })
           return false
         }
       }
     }

    // Écouter les clics sur toute la page
    document.addEventListener('click', handleClick, { capture: true })
    document.addEventListener('click', handleButtonClick, { capture: true })

         return () => {
       window.removeEventListener('beforeunload', handleBeforeUnload)
       document.removeEventListener('click', handleClick, { capture: true })
       document.removeEventListener('click', handleButtonClick, { capture: true })
     }
   }, [hasUnsavedChanges, message, pathname, handleBeforeUnload, handleNavigationAttempt])

  // Protection pour les changements de route programmatiques
  useEffect(() => {
    const originalPush = router.push
    const originalReplace = router.replace
    const originalBack = router.back
    const originalForward = router.forward

         router.push = (href: string, options?: any) => {
       if (hasUnsavedChanges && href !== pathname) {
         handleNavigationAttempt(() => originalPush(href, options))
         return Promise.resolve()
       }
       return originalPush(href, options)
     }

     router.replace = (href: string, options?: any) => {
       if (hasUnsavedChanges && href !== pathname) {
         handleNavigationAttempt(() => originalReplace(href, options))
         return Promise.resolve()
       }
       return originalReplace(href, options)
     }

     router.back = () => {
       if (hasUnsavedChanges) {
         handleNavigationAttempt(() => originalBack())
         return
       }
       return originalBack()
     }

     router.forward = () => {
       if (hasUnsavedChanges) {
         handleNavigationAttempt(() => originalForward())
         return
       }
       return originalForward()
     }

    return () => {
      router.push = originalPush
      router.replace = originalReplace
      router.back = originalBack
      router.forward = originalForward
    }
       }, [hasUnsavedChanges, pathname, router, handleNavigationAttempt])

  return {
    showModal,
    saving,
    handleSaveAndContinue,
    handleDiscardAndContinue,
    handleCancel
  }
} 