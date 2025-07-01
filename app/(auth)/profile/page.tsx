'use client'

import { useState, useEffect } from 'react'
import { User, Settings, ChevronRight, Trash2, Eye, EyeOff, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/hooks/useLanguage'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { useToast } from '@/hooks/useToast'
import UnsavedChangesModal from '@/components/UnsavedChangesModal'

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { showSuccess, showError } = useToast()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    notifications: true,
    profilePicture: null as File | null
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    notifications: true,
    profilePicture: null as File | null
  })

  // Charger les données au montage du composant
  useEffect(() => {
    loadProfileData()
    loadSettings()
  }, [])

  const loadProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const userData = await response.json()
        const profileData = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          newPassword: '',
          notifications: userData.notifications || true,
          profilePicture: null as File | null
        }
        setFormData(profileData)
        setOriginalData({ ...profileData })
        setHasUnsavedChanges(false)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const settings = await response.json()
        // Synchroniser avec les hooks
        if (settings.notifications !== formData.notifications) {
          setFormData(prev => ({ ...prev, notifications: settings.notifications }))
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    // Détecter les changements en excluant newPassword vide et profilePicture
    const dataToCompare = {
      firstName: newFormData.firstName,
      lastName: newFormData.lastName,
      email: newFormData.email,
      notifications: newFormData.notifications
    }
    const originalToCompare = {
      firstName: originalData.firstName,
      lastName: originalData.lastName,
      email: originalData.email,
      notifications: originalData.notifications
    }
    
    // Ajouter le nouveau mot de passe seulement s'il n'est pas vide
    const hasPasswordChange = newFormData.newPassword.trim() !== ''
    const hasChanges = JSON.stringify(dataToCompare) !== JSON.stringify(originalToCompare) || hasPasswordChange
    
    setHasUnsavedChanges(hasChanges)
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleInputChange('profilePicture', file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          newPassword: formData.newPassword
        })
      })

      if (response.ok) {
        showSuccess(t('profileUpdated'))
        
        // Récupérer les nouvelles données depuis la réponse
        const responseData = await response.json()
        const userFromResponse = responseData.user || responseData
        
        const updatedData = {
          firstName: userFromResponse.firstName || formData.firstName,
          lastName: userFromResponse.lastName || formData.lastName,
          email: userFromResponse.email || formData.email,
          newPassword: '', // Toujours vider le mot de passe après sauvegarde
          notifications: formData.notifications,
          profilePicture: formData.profilePicture
        }
        
        setFormData(updatedData)
        setOriginalData({ ...updatedData })
        setHasUnsavedChanges(false)
      } else {
        const error = await response.json()
        showError('Erreur', error.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      showError('Erreur', 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  

  // État pour la modal de changement d'onglet
  const [pendingTab, setPendingTab] = useState<string | null>(null)
  const [showTabModal, setShowTabModal] = useState(false)

  // Protection contre sortie sans sauvegarde
  const { showModal, saving: modalSaving, handleSaveAndContinue, handleDiscardAndContinue, handleCancel } = useUnsavedChanges({
    hasUnsavedChanges,
    onSave: handleSave,
    message: t('unsavedChanges')
  })

  // Gestion du changement d'onglet avec protection
  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      setPendingTab(newTab)
      setShowTabModal(true)
    } else {
      setActiveTab(newTab)
    }
  }

  const handleTabSaveAndContinue = async () => {
    try {
      await handleSave()
      setShowTabModal(false)
      if (pendingTab) {
        setActiveTab(pendingTab)
        setPendingTab(null)
      }
    } catch {
      // L'erreur est déjà gérée dans handleSave
    }
  }

  const handleTabDiscardAndContinue = () => {
    setShowTabModal(false)
    if (pendingTab) {
      setActiveTab(pendingTab)
      setPendingTab(null)
      setHasUnsavedChanges(false)
    }
  }

  const handleTabCancel = () => {
    setShowTabModal(false)
    setPendingTab(null)
  }

  const handleDeleteAccount = async () => {
    // Utiliser une confirmation personnalisée au lieu de confirm()
    const shouldDelete = window.confirm(t('confirmDelete'))
    if (shouldDelete) {
      setLoading(true)
      try {
        const response = await fetch('/api/profile', {
          method: 'DELETE'
        })

        if (response.ok) {
          showSuccess(t('accountDeleted'))
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
        } else {
          const error = await response.json()
          showError('Erreur', error.error || 'Erreur lors de la suppression du compte')
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        showError('Erreur', 'Erreur lors de la suppression du compte')
      } finally {
        setLoading(false)
      }
    }
  }

    return (
    <div className="min-h-screen flex items-center justify-center p-4 profile-page-container">
      {/* Container principal centré */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex rounded-2xl overflow-hidden shadow-2xl linkestiam-profile-container">
          {/* Sidebar */}
          <div className="w-80 p-8 linkestiam-sidebar profile-sidebar">
            {/* Profil utilisateur */}
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden linkestiam-profile-picture">
                  {formData.profilePicture ? (
                    <img 
                      src={URL.createObjectURL(formData.profilePicture)} 
                      alt="Photo de profil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 profile-user-name" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                  <label htmlFor="profile-picture" className="cursor-pointer">
                    <Camera className="w-3 h-3" style={{ color: '#8C2CFF' }} />
                  </label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
              </div>
              <h1 className="text-xl font-bold mb-1 profile-user-name">
                {formData.firstName && formData.lastName 
                  ? `${formData.firstName} ${formData.lastName}` 
                  : t('user')}
              </h1>
              <h2 className="text-sm profile-user-subtitle">{t('linkestiamProfile')}</h2>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left linkestiam-sidebar-item profile-nav-button ${
                  activeTab === 'profile' ? 'active' : ''
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                {t('profile')}
              </button>
              <button
                onClick={() => handleTabChange('settings')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left linkestiam-sidebar-item profile-nav-button ${
                  activeTab === 'settings' ? 'active' : ''
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                {t('settings')}
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 linkestiam-content profile-content">
            {activeTab === 'profile' && (
              <div className="max-w-lg mx-auto linkestiam-form-content">
                <h2 className="text-3xl font-bold mb-8 text-center profile-title">{t('profile')}</h2>
                
                <div className="space-y-6">
                  {/* First Name Field */}
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium block mb-2 profile-label">
                      {t('firstName')}
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                      placeholder={t('enterFirstName')}
                      className="w-full profile-input"
                    />
                  </div>

                  {/* Last Name Field */}
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium block mb-2 profile-label">
                      {t('lastName')}
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                      placeholder={t('enterLastName')}
                      className="w-full profile-input"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium block mb-2 profile-label">
                      {t('email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                      placeholder={t('enterEmail')}
                      className="w-full profile-input"
                    />
                  </div>

                  {/* New Password Field */}
                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium block mb-2 profile-label">
                      {t('newPassword')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('newPassword', e.target.value)}
                        placeholder={t('enterNewPassword')}
                        className="w-full pr-10 profile-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Centered Save Button */}
                  <div className="pt-6 text-center">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-12 py-3 disabled:opacity-50 linkestiam-button text-lg font-medium"
                    >
                      {loading ? t('saving') : t('save')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-lg mx-auto linkestiam-form-content">
                <h2 className="text-3xl font-bold mb-8 text-center profile-title">{t('settings')}</h2>
                
                <div className="space-y-6">
                  {/* Send Notifications */}
                  <div className="flex items-center justify-between py-4 border-b profile-border">
                    <span className="font-medium text-lg profile-settings-text">{t('notifications')}</span>
                    <Switch
                      checked={formData.notifications}
                      onCheckedChange={(checked) => handleInputChange('notifications', checked)}
                    />
                  </div>

                  {/* Dark Mode */}
                  <div className="flex items-center justify-between py-4 border-b profile-border">
                    <span className="font-medium text-lg profile-settings-text">{t('darkMode')}</span>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={(checked) => {
                        toggleDarkMode(checked)
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>

                  {/* Language */}
                  <div className="flex items-center justify-between py-4 border-b profile-border">
                    <span className="font-medium text-lg profile-settings-text">{t('language')}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setLanguage('fr')
                          setHasUnsavedChanges(true)
                        }}
                        className={`px-3 py-1 rounded ${language === 'fr' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                      >
                        FR
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('en')
                          setHasUnsavedChanges(true)
                        }}
                        className={`px-3 py-1 rounded ${language === 'en' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="flex items-center justify-between py-4 border-b cursor-pointer settings-hover-item profile-border">
                    <span className="font-medium text-lg profile-settings-text">{t('security')}</span>
                    <ChevronRight className="w-5 h-5 profile-icon" />
                  </div>

                  {/* Theme */}
                  <div className="flex items-center justify-between py-4 border-b cursor-pointer settings-hover-item profile-border">
                    <span className="font-medium text-lg profile-settings-text">{t('theme')}</span>
                    <ChevronRight className="w-5 h-5 profile-icon" />
                  </div>

                  {/* Centered Buttons */}
                  <div className="pt-8 text-center">
                    {/* Delete Account Text - Discret */}
                    <div className="text-center">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading || modalSaving}
                        className="linkestiam-delete-text disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t('deleteAccount')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour changements non sauvegardés - Navigation externe */}
      <UnsavedChangesModal
        isOpen={showModal}
        onSave={handleSaveAndContinue}
        onDiscard={handleDiscardAndContinue}
        onCancel={handleCancel}
        saving={modalSaving}
      />

      {/* Modal pour changements non sauvegardés - Changement d'onglet */}
      <UnsavedChangesModal
        isOpen={showTabModal}
        onSave={handleTabSaveAndContinue}
        onDiscard={handleTabDiscardAndContinue}
        onCancel={handleTabCancel}
        saving={loading}
      />
    </div>
    )
}