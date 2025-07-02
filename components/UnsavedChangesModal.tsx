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
      <div className="relative bg-white dark:bg-[#1A1A22] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-[#E5E5EA] dark:border-[#333333]">
        {/* Header avec couleur LinkESTIAM */}
        <div className="px-6 py-4" style={{ backgroundColor: '#8C2CFF' }}>
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
          <p className="text-[#222222] dark:text-[#F0F0F5] text-base leading-relaxed mb-6">
            {t('unsavedChangesMessage')}
          </p>

          {/* Boutons d'action */}
          <div className="space-y-3">
            {/* Bouton Enregistrer */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                backgroundColor: '#8C2CFF',
                '&:hover': { backgroundColor: '#6B1FB3' }
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = '#6B1FB3'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = '#8C2CFF'
                }
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? t('saving') : t('saveAndContinue')}
            </button>

            {/* Bouton Quitter sans sauvegarder */}
            <button
              onClick={onDiscard}
              disabled={saving}
              className="w-full bg-[#F8F7FB] hover:bg-[#E5E5EA] dark:bg-[#2A2A38] dark:hover:bg-[#333333] disabled:opacity-50 text-[#222222] dark:text-[#F0F0F5] font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-[#E5E5EA] dark:border-[#333333]"
            >
              <X className="w-4 h-4" />
              {t('discardAndContinue')}
            </button>

            {/* Bouton Annuler */}
            <button
              onClick={onCancel}
              disabled={saving}
              className="w-full bg-transparent hover:bg-[#F8F7FB] dark:hover:bg-[#2A2A38] disabled:opacity-50 text-[#6D6D85] font-medium py-3 px-4 rounded-xl transition-all duration-200"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 