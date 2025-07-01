'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'fr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  fr: {
    // Navigation
    profile: 'Profil',
    settings: 'Paramètres',
    
    // Profile page
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    newPassword: 'Nouveau mot de passe',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    
    // Settings
    notifications: 'Notifications',
    darkMode: 'Mode sombre',
    language: 'Langue',
    security: 'Sécurité',
    theme: 'Thème',
    saveSettings: 'Sauvegarder les paramètres',
    deleteAccount: 'Supprimer le compte',
    
    // Placeholders
    enterFirstName: 'Entrez votre prénom',
    enterLastName: 'Entrez votre nom de famille',
    enterEmail: 'exemple@linkestiam.com',
    enterNewPassword: 'Entrez un nouveau mot de passe',
    
    // Messages
    profileUpdated: 'Profil mis à jour avec succès !',
    settingsUpdated: 'Paramètres mis à jour avec succès !',
    accountDeleted: 'Compte supprimé avec succès',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
    unsavedChanges: 'Vous avez des modifications non sauvegardées. Voulez-vous les enregistrer avant de continuer ?',
    unsavedChangesTitle: 'Modifications non sauvegardées',
    unsavedChangesMessage: 'Vous avez des modifications qui ne sont pas encore sauvegardées. Que souhaitez-vous faire ?',
    saveAndContinue: 'Enregistrer et continuer',
    discardAndContinue: 'Quitter sans sauvegarder',
    cancel: 'Annuler',
    user: 'Utilisateur',
    linkestiamProfile: 'Profil LinkESTIAM',
    
    // Homepage
    getStarted: 'Commencez par éditer',
    saveChanges: 'Sauvegardez et voyez vos changements instantanément.',
    profileExamples: 'Exemples d\'icônes profil pour votre interface :',
    myProfile: 'Mon profil',
    mainInterface: 'Interface principale de l\'app',
    deployNow: 'Déployer maintenant',
    readDocs: 'Lire nos docs',
    learn: 'Apprendre',
    examples: 'Exemples',
    goToNextJs: 'Aller sur nextjs.org →'
  },
  en: {
    // Navigation
    profile: 'Profile',
    settings: 'Settings',
    
    // Profile page
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    newPassword: 'New Password',
    save: 'Save',
    saving: 'Saving...',
    
    // Settings
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    language: 'Language',
    security: 'Security',
    theme: 'Theme',
    saveSettings: 'Save Settings',
    deleteAccount: 'Delete Account',
    
    // Placeholders
    enterFirstName: 'Enter your first name',
    enterLastName: 'Enter your last name',
    enterEmail: 'example@linkestiam.com',
    enterNewPassword: 'Enter a new password',
    
    // Messages
    profileUpdated: 'Profile updated successfully!',
    settingsUpdated: 'Settings updated successfully!',
    accountDeleted: 'Account deleted successfully',
    confirmDelete: 'Are you sure you want to delete your account? This action is irreversible.',
    unsavedChanges: 'You have unsaved changes. Would you like to save them before continuing?',
    unsavedChangesTitle: 'Unsaved Changes',
    unsavedChangesMessage: 'You have changes that are not yet saved. What would you like to do?',
    saveAndContinue: 'Save and Continue',
    discardAndContinue: 'Discard and Continue',
    cancel: 'Cancel',
    user: 'User',
    linkestiamProfile: 'LinkESTIAM Profile',
    
    // Homepage
    getStarted: 'Get started by editing',
    saveChanges: 'Save and see your changes instantly.',
    profileExamples: 'Profile icon examples for your interface:',
    myProfile: 'My profile',
    mainInterface: 'Main app interface',
    deployNow: 'Deploy now',
    readDocs: 'Read our docs',
    learn: 'Learn',
    examples: 'Examples',
    goToNextJs: 'Go to nextjs.org →'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [language, setLanguage] = useState<Language>('fr')

  useEffect(() => {
    const savedLang = localStorage.getItem('linkestiam-language') as Language
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('linkestiam-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 