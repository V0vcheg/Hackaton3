'use client'

import { useState, useEffect } from 'react'
import { User, Trash2, Eye, EyeOff, Camera, Mail, BadgeCheck, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/hooks/useLanguage'
import { useToast } from '@/hooks/useToast'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import DeleteAccountDialog from '@/components/DeleteAccountDialog'
import UnsavedChangesModal from '@/components/UnsavedChangesModal'

export default function ProfilePage() {
  const { t } = useLanguage()
  const { showSuccess, showError } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    profilePicture: null as File | null
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    profilePicture: null as File | null
  })

  // Charger les données au montage du composant
  useEffect(() => {
    loadProfileData()
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

  const handleInputChange = (field: string, value: string | File | null) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    // Détecter les changements
    const dataToCompare = {
      firstName: newFormData.firstName,
      lastName: newFormData.lastName,
      email: newFormData.email,
    }
    const originalToCompare = {
      firstName: originalData.firstName,
      lastName: originalData.lastName,
      email: originalData.email,
    }
    
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
        
        const responseData = await response.json()
        const userFromResponse = responseData.user || responseData
        
        const updatedData = {
          firstName: userFromResponse.firstName || formData.firstName,
          lastName: userFromResponse.lastName || formData.lastName,
          email: userFromResponse.email || formData.email,
          newPassword: '',
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

  const [pendingTab, setPendingTab] = useState<string | null>(null)
  const [showTabModal, setShowTabModal] = useState(false)

  // Hook pour la gestion des modifications non sauvegardées
  const unsavedChangesModal = useUnsavedChanges({
    hasUnsavedChanges,
    onSave: handleSave,
    message: t('unsavedChanges')
  })

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
    <>
      <Card 
        className="border-0 shadow-lg bg-[#F8F7FB] dark:bg-[#1A1A22] border-[#E5E5EA] dark:border-[#333333]"
        style={{ height: 'calc(100vh - 8rem)' }}
      >
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-4 shadow-lg"
                style={{ backgroundColor: '#8C2CFF', borderColor: 'rgba(140, 44, 255, 0.3)' }}
              >
                  {formData.profilePicture ? (
                    <img 
                      src={URL.createObjectURL(formData.profilePicture)} 
                      alt="Photo de profil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                  <User className="w-7 h-7 text-white" />
                  )}
                </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-[#1A1A22] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
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
            
            <div className="flex-1">
              <h1 className="text-xl font-semibold flex items-center gap-2 text-[#222222] dark:text-[#F0F0F5]">
                {formData.firstName && formData.lastName 
                  ? `${formData.firstName} ${formData.lastName}` 
                  : t('myProfile')}
                <BadgeCheck className="w-5 h-5" style={{ color: '#8C2CFF' }} />
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
                    <AlertTriangle className="w-3 h-3" />
                    Non sauvegardé
                  </div>
                )}
              </h1>
              <p className="text-xs mt-1 flex items-center gap-2 text-[#6D6D85]">
                <Mail className="w-3 h-3" />
                {formData.email || 'email@linkestiam.com'}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <Separator className="bg-[#E5E5EA] dark:bg-[#333333]" />
        
        <CardContent className="p-6">
          <div className="max-w-lg mx-auto space-y-5">
            
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
            
            {/* Section Informations personnelles */}
            <div>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-[#222222] dark:text-[#F0F0F5]">
                <User className="w-4 h-4" style={{ color: '#8C2CFF' }} />
                {t('personalInfo')}
              </h3>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Prénom */}
                  <div>
                  <Label htmlFor="firstName" className="text-xs font-medium mb-1 text-[#6D6D85]">
                      {t('firstName')}
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                    placeholder={t('enterFirstName')}
                    className="w-full border-2 transition-colors focus:ring-0 bg-white dark:bg-[#2A2A38] border-[#E5E5EA] dark:border-[#333333] text-[#222222] dark:text-[#F0F0F5] text-sm"
                    />
                  </div>

                {/* Nom */}
                  <div>
                  <Label htmlFor="lastName" className="text-xs font-medium mb-1 text-[#6D6D85]">
                      {t('lastName')}
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                    placeholder={t('enterLastName')}
                    className="w-full border-2 transition-colors focus:ring-0 bg-white dark:bg-[#2A2A38] border-[#E5E5EA] dark:border-[#333333] text-[#222222] dark:text-[#F0F0F5] text-sm"
                    />
                </div>
                  </div>

              {/* Email */}
              <div className="mt-3">
                <Label htmlFor="email" className="text-xs font-medium mb-1 text-[#6D6D85]">
                      {t('email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                placeholder={t('enterEmail')}
                className="w-full border-2 transition-colors focus:ring-0 bg-white dark:bg-[#2A2A38] border-[#E5E5EA] dark:border-[#333333] text-[#222222] dark:text-[#F0F0F5] text-sm"
                  />
                </div>
            </div>

            {/* Section Sécurité */}
            <div>
              <h3 className="text-base font-semibold mb-3 text-[#222222] dark:text-[#F0F0F5]">
                {t('security')}
              </h3>
              
                  <div>
                <Label htmlFor="newPassword" className="text-xs font-medium mb-1 text-[#6D6D85]">
                  {t('newPassword')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('newPassword', e.target.value)}
                    placeholder={t('enterNewPassword')}
                    className="w-full pr-10 border-2 transition-colors focus:ring-0 bg-white dark:bg-[#2A2A38] border-[#E5E5EA] dark:border-[#333333] text-[#222222] dark:text-[#F0F0F5] text-sm"
                      />
                  <Button
                        type="button"
                    variant="ghost"
                    size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
                      >
                        {showPassword ? (
                      <EyeOff className="w-3 h-3 text-[#6D6D85]" />
                        ) : (
                      <Eye className="w-3 h-3 text-[#6D6D85]" />
                    )}
                    </Button>
                </div>
              </div>
                  </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={loading || !hasUnsavedChanges}
                className={`w-full py-2.5 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 ${
                  hasUnsavedChanges ? 'animate-pulse' : ''
                }`}
                style={{ 
                  backgroundColor: hasUnsavedChanges ? '#8C2CFF' : '#6D6D85',
                  transform: hasUnsavedChanges ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                {loading ? t('saving') : t('saveChanges')}
              </Button>
              
              {hasUnsavedChanges && (
                <p className="text-xs text-center text-orange-600 dark:text-orange-400 font-medium">
                  ⚠️ {t('unsavedChanges')}
                </p>
              )}
                  </div>

            {/* Zone de danger */}
            <div className="pt-6 border-t border-[#E5E5EA] dark:border-[#333333]">
              <h3 className="text-base font-semibold mb-2 text-[#222222] dark:text-[#F0F0F5]">
                {t('dangerZone')}
              </h3>
              <p className="text-xs mb-3 text-[#6D6D85]">
                {t('dangerZoneDescription')}
              </p>
              <DeleteAccountDialog 
                onConfirm={handleDeleteAccount}
                isLoading={loading}
              />
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