'use client'

import { useState, useEffect } from 'react'
import { Settings, AlertTriangle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/hooks/useLanguage'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useToast } from '@/hooks/useToast'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import UnsavedChangesModal from '@/components/UnsavedChangesModal'

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { showSuccess, showError } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalSettings, setOriginalSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'fr' as 'fr' | 'en'
  })
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'fr' as 'fr' | 'en'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  // Détecter les changements
  useEffect(() => {
    const current = JSON.stringify(settings)
    const original = JSON.stringify(originalSettings)
    const hasChanges = current !== original
    
    setHasUnsavedChanges(hasChanges)
  }, [settings, originalSettings])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        const settingsData = {
          notifications: data.notifications || true,
          darkMode: isDarkMode,
          language: language
        }
        setSettings(settingsData)
        setOriginalSettings({ ...settingsData })
        setHasUnsavedChanges(false)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        showSuccess(t('settingsUpdated'))
        setOriginalSettings({ ...settings })
        setHasUnsavedChanges(false)
      } else {
        showError('Erreur', 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      showError('Erreur', 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  // Hook pour la gestion des modifications non sauvegardées
  const unsavedChangesModal = useUnsavedChanges({
    hasUnsavedChanges,
    onSave: handleSaveSettings,
    message: t('unsavedChanges')
  })

  const handleNotificationChange = (checked: boolean) => {
    console.log('🔔 Notification changed:', checked)
    setSettings(prev => ({ ...prev, notifications: checked }))
  }

  const handleDarkModeChange = (checked: boolean) => {
    console.log('🌙 Dark mode changed:', checked)
    toggleDarkMode(checked)
    setSettings(prev => ({ ...prev, darkMode: checked }))
  }

  const handleLanguageChange = (newLanguage: 'fr' | 'en') => {
    console.log('🌍 Language changed:', newLanguage)
    setLanguage(newLanguage)
    setSettings(prev => ({ ...prev, language: newLanguage }))
  }

  return (
    <>
      <Card 
        className="border-0 shadow-lg bg-[#F8F7FB] dark:bg-[#1A1A22] border-[#E5E5EA] dark:border-[#333333]"
        style={{ height: 'calc(100vh - 8rem)' }}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#8C2CFF' }}
            >
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-[#222222] dark:text-[#F0F0F5]">
                  {t('settings')}
                </h1>
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
                    <AlertTriangle className="w-3 h-3" />
                    Non sauvegardé
                  </div>
                )}
              </div>
              <p className="text-xs mt-1 text-[#6D6D85]">
                {t('customizeExperience')}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <Separator className="bg-[#E5E5EA] dark:bg-[#333333]" />
        
        <CardContent className="p-6 space-y-5">
          <div className="max-w-2xl mx-auto space-y-5">
            
            {/* Avertissement pour modifications non sauvegardées */}
            {hasUnsavedChanges && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                    Vous avez des modifications non sauvegardées
                  </p>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  N&apos;oubliez pas de sauvegarder avant de quitter cette page
                </p>
              </div>
            )}
            
            {/* Notifications */}
            <div className="flex items-center justify-between py-3 border-b-2 border-[#E5E5EA] dark:border-[#333333]">
              <div>
                <Label className="text-sm font-medium text-[#222222] dark:text-[#F0F0F5]">
                  {t('notifications')}
                </Label>
                <p className="text-xs mt-1 text-[#6D6D85]">
                  {t('emailNotifications')}
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={handleNotificationChange}
              />
            </div>

            {/* Mode sombre */}
            <div className="flex items-center justify-between py-3 border-b-2 border-[#E5E5EA] dark:border-[#333333]">
              <div>
                <Label className="text-sm font-medium text-[#222222] dark:text-[#F0F0F5]">
                  {t('darkMode')}
                </Label>
                <p className="text-xs mt-1 text-[#6D6D85]">
                  {t('darkModeDescription')}
                </p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={handleDarkModeChange}
              />
            </div>

            {/* Langue */}
            <div className="flex items-center justify-between py-3 border-b-2 border-[#E5E5EA] dark:border-[#333333]">
              <div>
                <Label className="text-sm font-medium text-[#222222] dark:text-[#F0F0F5]">
                  {t('language')}
                </Label>
                <p className="text-xs mt-1 text-[#6D6D85]">
                  {t('languageDescription')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleLanguageChange('fr')}
                  variant={language === 'fr' ? 'default' : 'outline'}
                  size="sm"
                  className={`text-sm ${language === 'fr' ? 'text-white' : ''}`}
                  style={language === 'fr' ? { backgroundColor: '#8C2CFF', borderColor: '#8C2CFF' } : {}}
                >
                  Français
                </Button>
                <Button
                  onClick={() => handleLanguageChange('en')}
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  className={`text-sm ${language === 'en' ? 'text-white' : ''}`}
                  style={language === 'en' ? { backgroundColor: '#8C2CFF', borderColor: '#8C2CFF' } : {}}
                >
                  English
                </Button>
              </div>
            </div>

            {/* Sécurité */}
            <div className="py-3">
              <Label className="text-sm font-medium text-[#222222] dark:text-[#F0F0F5]">
                {t('securityPrivacy')}
              </Label>
              <p className="text-xs mt-1 text-[#6D6D85]">
                {t('securityDescription')}
              </p>
            </div>

            {/* Bouton Sauvegarder */}
            <div className="pt-4 text-center">
              <Button
                onClick={handleSaveSettings}
                disabled={loading || !hasUnsavedChanges}
                className={`px-6 py-2.5 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 ${
                  hasUnsavedChanges ? 'animate-pulse' : ''
                }`}
                style={{ 
                  backgroundColor: hasUnsavedChanges ? '#8C2CFF' : '#6D6D85',
                  transform: hasUnsavedChanges ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                {loading ? t('saving') : t('saveSettings')}
              </Button>
              
              {/* Afficher le statut des modifications non sauvegardées */}
              {hasUnsavedChanges && (
                <div className="text-center py-2 mt-2">
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    ⚠️ {t('unsavedChanges')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal pour les modifications non sauvegardées */}
      <UnsavedChangesModal
        isOpen={unsavedChangesModal.showModal}
        onSave={unsavedChangesModal.handleSaveAndContinue}
        onDiscard={unsavedChangesModal.handleDiscardAndContinue}
        onCancel={unsavedChangesModal.handleCancel}
        saving={unsavedChangesModal.saving}
      />
    </>
  )
} 