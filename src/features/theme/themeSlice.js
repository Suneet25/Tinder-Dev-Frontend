import { createSlice } from "@reduxjs/toolkit";

export const THEMES = [
  { id: "midnight", name: "Midnight", description: "Default dark", bg: "#0E0F13", surface: "#20232C", primary: "#FF6B4A", text: "#F4F5F7" },
  { id: "paper", name: "Paper", description: "Light, calm", bg: "#F4EFE6", surface: "#ECE5D8", primary: "#C2410C", text: "#1F1B16" },
  { id: "editor", name: "Editor Dark", description: "For coders", bg: "#1E1E1E", surface: "#2D2D2D", primary: "#4FC1FF", text: "#D4D4D4" },
  { id: "iron", name: "Iron", description: "Gym energy", bg: "#0A0A0A", surface: "#222222", primary: "#C6F432", text: "#FFFFFF" },
  { id: "blush", name: "Blush", description: "Soft, romantic", bg: "#FFF4F5", surface: "#FFE6EA", primary: "#E11D48", text: "#3A0D18" },
];

const STORAGE_KEY = "tinder-dev:theme";

function readSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.some((t) => t.id === saved) ? saved : "midnight";
  } catch {
    return "midnight";
  }
}

export function persistTheme(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage blocked (private mode): theme just won't persist
  }
}

const themeSlice = createSlice({
  name: "theme",
  initialState: { current: readSavedTheme() },
  reducers: {
    setTheme(state, { payload }) {
      if (THEMES.some((t) => t.id === payload)) state.current = payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
