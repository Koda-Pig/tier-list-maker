import { Moon, Presentation, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { TierListFeature } from "./tier-list/TierListFeature";
import { DEFAULT_TITLE } from "./tier-list/state";

const THEME_STORAGE_KEY = "tier-list-maker-theme";
type Theme = "system" | "light" | "dark";

function getPreferredColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function App() {
  const [featureTitle, setFeatureTitle] = useState(DEFAULT_TITLE);
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === "system" || stored === "light" || stored === "dark") {
      return stored;
    }

    return "system";
  });
  const [preferredColorScheme, setPreferredColorScheme] = useState<
    "light" | "dark"
  >(getPreferredColorScheme);
  const isDarkMode =
    theme === "system" ? preferredColorScheme === "dark" : theme === "dark";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setPreferredColorScheme(mediaQuery.matches ? "dark" : "light");
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (theme === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const nextTitle = featureTitle.trim();
    document.title = nextTitle.length > 0 ? nextTitle : DEFAULT_TITLE;
  }, [featureTitle]);

  useEffect(() => {
    if (!isPresentMode) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPresentMode(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresentMode]);

  return (
    <main className="min-h-svh bg-linear-to-b from-slate-100 to-slate-200 px-4 py-5 text-slate-900 transition-colors dark:from-slate-900 dark:to-[#07070b] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="rounded-lg border border-slate-300/70 bg-white/85 p-5 shadow-xl shadow-slate-300/35 backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/30">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-medium text-amber-700 dark:text-amber-300">
              Tier List Maker
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={isPresentMode}
                aria-label={
                  isPresentMode ? "Exit present mode" : "Enter present mode"
                }
                className="h-9 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:ring-4 focus:ring-amber-500/15 focus-visible:ring-4 focus-visible:ring-amber-500/20 data-[pressed=true]:border-amber-500/40 data-[pressed=true]:bg-amber-500/10 data-[pressed=true]:text-amber-800 dark:border-white/10 dark:bg-white/4 dark:text-slate-100 dark:hover:bg-white/8 dark:focus:ring-amber-400/15 dark:focus-visible:ring-amber-400/20 dark:data-[pressed=true]:border-amber-300/40 dark:data-[pressed=true]:bg-amber-400/10 dark:data-[pressed=true]:text-amber-200 grid place-items-center px-3 data-[pressed=true]:w-9 data-[pressed=true]:px-0"
                data-pressed={isPresentMode ? "true" : "false"}
                onClick={() => setIsPresentMode((current) => !current)}
              >
                {isPresentMode ? (
                  <Presentation aria-hidden="true" className="size-4" />
                ) : (
                  "Present"
                )}
              </button>
              <button
                type="button"
                aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 outline-none transition hover:bg-slate-50 focus:ring-4 focus:ring-amber-500/15 focus-visible:ring-4 focus-visible:ring-amber-500/20 dark:border-white/10 dark:bg-white/4 dark:text-slate-100 dark:hover:bg-white/8 dark:focus:ring-amber-400/15 dark:focus-visible:ring-amber-400/20"
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              >
                {isDarkMode ? (
                  <Sun aria-hidden="true" className="size-4" />
                ) : (
                  <Moon aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
          </div>
        </header>
        <TierListFeature
          isPresentMode={isPresentMode}
          onTitleChange={setFeatureTitle}
        />
      </div>
    </main>
  );
}

export default App;
