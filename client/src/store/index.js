import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice.js";

export const useAppStore = create() ((...a) => ({
    ...createAuthSlice(...a),
})); // “Create a Zustand store hook called useAppStore. When initializing the store, run createAuthSlice with Zustand’s set, get, and api functions, and spread its state + actions into the store.”