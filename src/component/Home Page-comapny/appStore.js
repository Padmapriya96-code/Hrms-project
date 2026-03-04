// import create from "zustand";
// import { persist } from "zustand/middleware";

// let appStore = (set) => ({
//   dopen: true,
//   updateOpen: (dopen) => set(() => ({ dopen: dopen })),
// });

// appStore = persist(appStore, { name: "my_app_store" });
// export const useAppStore = create(appStore);


import create from "zustand";
import { persist } from "zustand/middleware";

let appStore = (set) => ({
  dopen: true,
  updateOpen: (dopen) => set(() => ({ dopen })),

  // ✅ ADD THIS (This removes your runtime error)
  toggle: false,
  setToggle: (value) => set(() => ({ toggle: value })),
});

appStore = persist(appStore, { name: "my_app_store" });
export const useAppStore = create(appStore);
