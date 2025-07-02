'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useLanguage } from '@/hooks/useLanguage'
import { useDarkMode } from '@/hooks/useDarkMode'

interface DeleteAccountDialogProps {
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export default function DeleteAccountDialog({ onConfirm, isLoading }: DeleteAccountDialogProps) {
  const { t } = useLanguage()
  const { isDarkMode } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = async () => {
    await onConfirm()
    setIsOpen(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="text-xs italic text-gray-400 hover:text-red-500 transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 flex items-center gap-1 underline-offset-4 hover:underline"
          disabled={isLoading}
          style={{ fontFamily: 'inherit' }}
        >
          <Trash2 className="w-3 h-3" />
          {t('deleteAccount')}
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent 
        className="sm:max-w-sm max-w-[95vw] mx-auto"
        style={{
          backgroundColor: isDarkMode ? '#1A1A22' : '#FFFFFF',
          borderColor: isDarkMode ? '#333333' : '#E5E5EA',
          color: isDarkMode ? '#F0F0F5' : '#222222'
        }}
      >
        <AlertDialogHeader className="text-center">
          <div className="flex flex-col items-center gap-3 mb-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2'
              }}
            >
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle 
              className="text-lg font-semibold text-center"
              style={{ color: isDarkMode ? '#F0F0F5' : '#111827' }}
            >
              {t('deleteAccount')}
            </AlertDialogTitle>
          </div>
          
          <AlertDialogDescription className="text-center space-y-3">
            <p 
              className="font-medium text-sm"
              style={{ color: isDarkMode ? '#F0F0F5' : '#111827' }}
            >
              {t('confirmDeleteTitle')}
            </p>
            <ul 
              className="space-y-2 text-xs text-left"
              style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
            >
              <li>• {t('deleteAccountWarning1')}</li>
              <li>• {t('deleteAccountWarning2')}</li>
              <li>• {t('deleteAccountWarning3')}</li>
            </ul>
            <div 
              className="text-xs font-medium p-3 rounded-md mx-auto"
              style={{
                color: '#DC2626',
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2'
              }}
            >
              <div className="flex items-center gap-2 justify-center">
                <span>⚠️</span>
                <span>{t('irreversibleAction')}</span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <AlertDialogCancel 
            className="text-sm px-6 py-2 w-full sm:w-auto order-2 sm:order-1"
            style={{
              borderColor: isDarkMode ? '#374151' : '#D1D5DB',
              color: isDarkMode ? '#D1D5DB' : '#374151',
              backgroundColor: isDarkMode ? 'transparent' : '#F9FAFB'
            }}
          >
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 text-sm px-6 py-2 w-full sm:w-auto order-1 sm:order-2"
            disabled={isLoading}
          >
            {isLoading ? t('deleting') : t('confirmDelete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 