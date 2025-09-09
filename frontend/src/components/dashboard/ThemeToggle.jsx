import React, { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

const storageKey = 'theme'

const applyThemeClass = (theme) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => (typeof window === 'undefined' ? 'light' : getInitialTheme()))

  useEffect(() => {
    applyThemeClass(theme)
    try { localStorage.setItem(storageKey, theme) } catch {}
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <FiSun size={18} />
      ) : (
        <FiMoon size={18} />
      )}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}

export default ThemeToggle

