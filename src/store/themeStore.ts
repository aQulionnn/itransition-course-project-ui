import { create } from 'zustand'

type Mode = 'light' | 'dark'

interface ThemeStore {
    mode: Mode
    toggle: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    mode: (localStorage.getItem('theme') as Mode) ?? 'light',
    toggle: () => set(state => {
        const next = state.mode === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', next)
        return { mode: next }
    })
}))