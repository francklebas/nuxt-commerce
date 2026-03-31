type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'aurora-theme-mode'

export const useTheme = () => {
  const mode = useState<ThemeMode>('theme-mode', () => 'light')

  const applyTheme = (value: ThemeMode) => {
    if (!import.meta.client) {
      return
    }

    document.documentElement.classList.toggle('dark', value === 'dark')
  }

  const setTheme = (value: ThemeMode) => {
    mode.value = value
    applyTheme(value)

    if (import.meta.client) {
      localStorage.setItem(THEME_STORAGE_KEY, value)
    }
  }

  const initTheme = () => {
    if (!import.meta.client) {
      return
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    setTheme(mode.value === 'dark' ? 'light' : 'dark')
  }

  return {
    mode,
    initTheme,
    setTheme,
    toggleTheme
  }
}
