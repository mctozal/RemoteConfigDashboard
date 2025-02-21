import { create } from "zustand";
import { Config } from "../interfaces/IConfig";

interface Store {
  configs: Config[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  setConfigs: (configs: Config[]) => void;
  addConfig: (config: Config) => void;
  updateConfig: (config: Config) => void;
  removeConfig: (id: string) => void;
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const useStore = create<Store>((set) => ({
  configs: [],
  sortBy: "name",
  sortOrder: "asc",
  setConfigs: (configs) => set({ configs }),
  addConfig: (config) =>
    set((state) => ({ configs: [...state.configs, config] })),
  updateConfig: (config) =>
    set((state) => ({
      configs: state.configs.map((c) => (c._id === config._id ? config : c)),
    })),
  removeConfig: (id) =>
    set((state) => ({ configs: state.configs.filter((c) => c._id !== id) })),
  setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
}));

export default useStore;
