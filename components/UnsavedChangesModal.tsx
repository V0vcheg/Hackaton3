'use client'

import { AlertTriangle, Save, X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface UnsavedChangesModalProps {
  isOpen: boolean
  onSave: () => Promise<void> | void
  onDiscard: () => void
  onCancel: () => void
  saving?: boolean
}

export default function UnsavedChangesModal({
  isOpen,
  onSave,
  onDiscard,
  onCancel,
  saving = false
}: UnsavedChangesModalProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  const handleSave = async () => {
    await onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header avec gradient LinkESTIAM */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t('unsavedChangesTitle')}
            </h3>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
            {t('unsavedChangesMessage')}
          </p>

          {/* Boutons d'action */}
          <div className="space-y-3">
            {/* Bouton Enregistrer */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              {saving ? t('saving') : t('saveAndContinue')}
            </button>

            {/* Bouton Quitter sans sauvegarder */}
            <button
              onClick={onDiscard}
              disabled={saving}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              {t('discardAndContinue')}
            </button>

            {/* Bouton Annuler */}
            <button
              onClick={onCancel}
              disabled={saving}
              className="w-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-600 dark:text-gray-400 font-medium py-3 px-4 rounded-xl transition-all duration-200"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 