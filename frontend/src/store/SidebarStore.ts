import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarStore {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
}

const sidebar: StateCreator<SidebarStore, [["zustand/persist", unknown]]> = (
  set
) => ({
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),
});

export const useSidebarStore = create<SidebarStore>()(
  persist(sidebar, {
    name: "sidebar-storage",
    storage: createJSONStorage(() => sessionStorage),
  })
);
