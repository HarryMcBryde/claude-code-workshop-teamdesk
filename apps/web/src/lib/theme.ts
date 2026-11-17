export type ThemeMode = "light" | "dark" | "auto" | "christmas";

export const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  auto: "light",
  christmas: "auto",
  dark: "christmas",
  light: "dark",
};

export function resolveTheme(
  mode: ThemeMode,
  prefersDark: boolean
): "light" | "dark" {
  if (mode === "auto") {
    return prefersDark ? "dark" : "light";
  }
  return mode === "christmas" ? "light" : mode;
}

export function parseThemeMode(stored: string | null | undefined): ThemeMode {
  if (
    stored === "light" ||
    stored === "dark" ||
    stored === "auto" ||
    stored === "christmas"
  ) {
    return stored;
  }
  return "auto";
}

export const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto'||stored==='christmas')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark','christmas');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved==='christmas'?'light':resolved;}catch(e){}})();`;
