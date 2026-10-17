export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export const INTRO_KEY = "am:intro:v1";
export const LANGUAGE_KEY = "am:language:v1";
export interface Preferences {
  seen: boolean;
  language: "en" | "ru";
}
export function readPreferences(storage: StorageLike): Preferences {
  try {
    return {
      seen:
        storage.getItem(INTRO_KEY) === "seen" ||
        storage.getItem("am:intro") === "seen",
      language:
        (storage.getItem(LANGUAGE_KEY) ?? storage.getItem("am:language")) ===
        "ru"
          ? "ru"
          : "en",
    };
  } catch {
    return { seen: false, language: "en" };
  }
}
export function writePreference(
  storage: StorageLike,
  key: string,
  value: string,
) {
  try {
    storage.setItem(key, value);
  } catch {
    /* Private or restricted storage must not block navigation. */
  }
}
export function shouldPlayIntro(seen: boolean, reducedMotion: boolean) {
  return !seen && !reducedMotion;
}
