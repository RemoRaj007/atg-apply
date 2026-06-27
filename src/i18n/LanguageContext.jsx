import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translate, LANGUAGES, DEFAULT_LANG } from './translations.js'

const STORAGE_KEY = 'atg-apply-lang'
const LanguageContext = createContext(null)

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LANGUAGES.some(l => l.code === saved)) return saved
  } catch {
    // localStorage unavailable (e.g. private browsing) — fall back silently
  }
  return DEFAULT_LANG
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const langMeta = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = langMeta.dir
  }, [lang, langMeta.dir])

  const setLang = useCallback((code) => {
    if (!LANGUAGES.some(l => l.code === code)) return
    setLangState(code)
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // ignore persistence failure — language still applies for this session
    }
  }, [])

  const t = useCallback((key, vars) => translate(key, lang, vars), [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: langMeta.dir, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}
