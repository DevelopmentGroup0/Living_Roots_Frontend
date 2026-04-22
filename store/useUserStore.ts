import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  userName: string | null
  setUserName: (name: string) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      setUserName: (name) => set({ userName: name }),
      clearUser: () => set({ userName: null }),
    }),
    {
      name: 'user-storage', // Clave en localStorage
    },
  ),
)
