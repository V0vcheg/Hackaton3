'use client'

import { User, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/hooks/useLanguage'

interface ProfileButtonProps {
  userName?: string
  className?: string
  showText?: boolean
  variant?: 'default' | 'compact' | 'icon-only'
}

export default function ProfileButton({ 
  userName, 
  className = "",
  showText = true,
  variant = "default"
}: ProfileButtonProps) {
  const router = useRouter()
  const { t } = useLanguage()
  
  // Utiliser la traduction comme valeur par défaut si userName n'est pas fourni
  const displayName = userName || t('myProfile')

  const handleClick = () => {
    router.push('/profile')
  }

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleClick}
        className={`profile-button-icon ${className}`}
        title={t('myProfile')}
        data-navigation="true"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center" 
             style={{ background: 'linear-gradient(to bottom right, #8C2CFF, #5A1B99)' }}>
          <User className="w-5 h-5" style={{ color: '#F0F0F5' }} />
        </div>
      </button>
    )
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`profile-button-compact ${className}`}
        data-navigation="true"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2" 
             style={{ background: 'linear-gradient(to bottom right, #8C2CFF, #5A1B99)' }}>
          <User className="w-4 h-4" style={{ color: '#F0F0F5' }} />
        </div>
        {showText && <span className="text-sm font-medium">{t('profile')}</span>}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`profile-button-default ${className}`}
      data-navigation="true"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" 
               style={{ background: 'linear-gradient(to bottom right, #8C2CFF, #5A1B99)' }}>
            <User className="w-6 h-6" style={{ color: '#F0F0F5' }} />
          </div>
          {showText && (
            <span className="text-white font-medium text-lg">{displayName}</span>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  )
} 