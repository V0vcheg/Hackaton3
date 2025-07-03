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
    // Navigation et Menu
    profile: 'Profil',
    settings: 'Paramètres',
    fileManager: 'Gestionnaire de fichiers',
    myProfile: 'Mon profil',
    passwordEntries: 'Gestionnaire de mots de passe',
    
    // Profile page
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    newPassword: 'Nouveau mot de passe',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    personalInfo: 'Informations personnelles',
    security: 'Sécurité',
    dangerZone: 'Zone de danger',
    saveChanges: 'Sauvegarder les modifications',
    unsavedChanges: 'Vous avez des modifications non sauvegardées',
    dangerZoneDescription: 'Cette action est irréversible. Toutes vos données seront définitivement supprimées.',
    
    // Settings
    notifications: 'Notifications',
    darkMode: 'Mode sombre',
    language: 'Langue',
    theme: 'Thème',
    saveSettings: 'Sauvegarder les paramètres',
    deleteAccount: 'Supprimer le compte',
    customizeExperience: 'Personnalisez votre expérience LinkESTIAM',
    emailNotifications: 'Recevoir des notifications par email',
    darkModeDescription: 'Interface sombre pour réduire la fatigue oculaire',
    languageDescription: 'Langue de l\'interface utilisateur',
    securityPrivacy: 'Sécurité et confidentialité',
    securityDescription: 'Gérez vos paramètres de sécurité et de confidentialité. Ces fonctionnalités seront disponibles prochainement.',
    
    // Files
    fileManagerTitle: 'Gestionnaire de fichiers',
    fileManagerDescription: 'Gérez et organisez vos documents en toute sécurité.',
    expandAll: 'Tout développer',
    collapseAll: 'Tout réduire',
    loadingFiles: 'Chargement des fichiers...',
    noFilesFound: 'Aucun fichier trouvé',
    expandFolder: 'Développer le dossier',
    collapseFolder: 'Réduire le dossier',
    downloadFile: 'Télécharger le fichier',
    
    // Upload Dialog
    uploadFiles: 'Télécharger des fichiers',
    uploadFilesTitle: 'Télécharger des fichiers',
    uploadDescription: 'Utilisez le formulaire ci-dessous pour télécharger des fichiers. Vous pouvez glisser-déposer les fichiers ou les sélectionner depuis votre appareil.',
    supportedFormats: 'Formats supportés : images, documents, et plus.',
    close: 'Fermer',
    
    // Placeholders
    enterFirstName: 'Votre prénom',
    enterLastName: 'Votre nom',
    enterEmail: 'votre.email@linkestiam.com',
    enterNewPassword: 'Entrez un nouveau mot de passe',
    
    // Messages
    profileUpdated: 'Profil mis à jour avec succès !',
    settingsUpdated: 'Paramètres mis à jour avec succès !',
    accountDeleted: 'Compte supprimé avec succès',
    confirmDelete: 'Supprimer',
    confirmDeleteTitle: 'Voulez-vous vraiment supprimer votre compte ?',
    deleteAccountWarning1: 'Toutes vos données personnelles seront supprimées',
    deleteAccountWarning2: 'Tous vos fichiers et documents seront perdus',
    deleteAccountWarning3: 'Vous ne pourrez plus accéder à votre compte',
    irreversibleAction: 'Cette action est irréversible et définitive',
    deleting: 'Suppression...',
    unsavedChangesTitle: 'Sauvegarde avant de quitter',
    unsavedChangesMessage: 'Vos modifications ne sont pas sauvegardées.',
    saveAndContinue: 'Enregistrer et continuer',
    discardAndContinue: 'Quitter sans sauvegarder',
    cancel: 'Annuler',
    user: 'Utilisateur',
    linkestiamProfile: 'Profil LinkESTIAM',
    
    // Homepage
    getStarted: 'Commencez par éditer',
    profileExamples: 'Exemples d\'icônes profil pour votre interface :',
    mainInterface: 'Interface principale de l\'app',
    deployNow: 'Déployer maintenant',
    readDocs: 'Lire nos docs',
    learn: 'Apprendre',
    examples: 'Exemples',
    goToNextJs: 'Aller sur nextjs.org →'
  },
  en: {
    // Navigation et Menu
    profile: 'Profile',
    settings: 'Settings',
    fileManager: 'File Manager',
    myProfile: 'My Profile',
    passwordEntries: 'Password Manager',
    // Profile page
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    newPassword: 'New Password',
    save: 'Save',
    saving: 'Saving...',
    personalInfo: 'Personal Information',
    security: 'Security',
    dangerZone: 'Danger Zone',
    saveChanges: 'Save Changes',
    unsavedChanges: 'You have unsaved changes',
    dangerZoneDescription: 'This action is irreversible. All your data will be permanently deleted.',
    
    // Settings
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    language: 'Language',
    theme: 'Theme',
    saveSettings: 'Save Settings',
    deleteAccount: 'Delete Account',
    customizeExperience: 'Customize your LinkESTIAM experience',
    emailNotifications: 'Receive email notifications',
    darkModeDescription: 'Dark interface to reduce eye strain',
    languageDescription: 'User interface language',
    securityPrivacy: 'Security and Privacy',
    securityDescription: 'Manage your security and privacy settings. These features will be available soon.',
    
    // Files
    fileManagerTitle: 'File Manager',
    fileManagerDescription: 'Manage and organize your documents securely.',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    loadingFiles: 'Loading files...',
    noFilesFound: 'No files found',
    expandFolder: 'Expand folder',
    collapseFolder: 'Collapse folder',
    downloadFile: 'Download file',
    
    // Upload Dialog
    uploadFiles: 'Upload Files',
    uploadFilesTitle: 'Upload Files',
    uploadDescription: 'Use the form below to upload files. You can drag and drop files or select them from your device.',
    supportedFormats: 'Supported formats: images, documents, and more.',
    close: 'Close',
    
    // Placeholders
    enterFirstName: 'Your first name',
    enterLastName: 'Your last name',
    enterEmail: 'your.email@linkestiam.com',
    enterNewPassword: 'Enter a new password',
    
    // Messages
    profileUpdated: 'Profile updated successfully!',
    settingsUpdated: 'Settings updated successfully!',
    accountDeleted: 'Account deleted successfully',
    confirmDelete: 'Delete',
    confirmDeleteTitle: 'Do you really want to delete your account?',
    deleteAccountWarning1: 'All your personal data will be deleted',
    deleteAccountWarning2: 'All your files and documents will be lost',
    deleteAccountWarning3: 'You will no longer be able to access your account',
    irreversibleAction: 'This action is irreversible and final',
    deleting: 'Deleting...',
    unsavedChangesTitle: 'Save before leaving',
    unsavedChangesMessage: 'Your changes are not saved.',
    saveAndContinue: 'Save and Continue',
    discardAndContinue: 'Discard and Continue',
    cancel: 'Cancel',
    user: 'User',
    linkestiamProfile: 'LinkESTIAM Profile',
    
    // Homepage
    getStarted: 'Get started by editing',
    profileExamples: 'Profile icon examples for your interface:',
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