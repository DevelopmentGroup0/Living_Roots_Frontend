import { create } from 'zustand'

// Estado del menú lateral en móvil (drawer). Lo comparten el botón del
// Navbar (hamburguesa) y el drawer que vive junto al Sidebar.
interface MobileNavState {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useMobileNavStore = create<MobileNavState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))
