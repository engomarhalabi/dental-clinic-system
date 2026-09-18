import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('clinic_lang') || 'ar')

  useEffect(() => {
    localStorage.setItem('clinic_lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const t = useMemo(() => {
    const dict = translations[lang]
    return (key) => dict[key] || key
  }, [lang])

  const value = { lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
