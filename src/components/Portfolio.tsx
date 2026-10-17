"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { contact, projects } from "@/content/portfolio";
import { translations, type Language } from "@/content/i18n";
import {
  useNavigation,
  type Screen,
  type ViewOptions,
} from "@/hooks/useNavigation";
import { getMenu } from "@/lib/menu";
import { siteUrl } from "@/lib/site";
import {
  readPreferences,
  writePreference,
  shouldPlayIntro,
  INTRO_KEY,
  LANGUAGE_KEY,
  type Preferences,
} from "@/lib/preferences";
import { Device } from "./Device";
function safelyStore(key: string, value: string) {
  try {
    writePreference(localStorage, key, value);
  } catch {}
}
export function Portfolio() {
  const [lang, setLang] = useState<Language>("en");
  const [intro, setIntro] = useState(false);
  const [nav, dispatch] = useNavigation();
  const t = translations[lang];
  const entries = useMemo(() => getMenu(nav, t, lang), [nav, t, lang]);
  const preferences = useRef<Preferences | null>(null);
  useEffect(() => {
    if (!preferences.current) {
      try {
        preferences.current = readPreferences(localStorage);
      } catch {
        preferences.current = { seen: false, language: "en" };
      }
    }
    const initial = preferences.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let nextFrame: number | undefined;
    const frame = requestAnimationFrame(() => {
      setLang(initial.language);
      setIntro(shouldPlayIntro(initial.seen, reduced.matches));
      nextFrame = requestAnimationFrame(() =>
        document.documentElement.removeAttribute("data-am-start"),
      );
    });
    safelyStore(INTRO_KEY, "seen");
    const timer = setTimeout(() => setIntro(false), 1900);
    const motionChange = () => {
      if (reduced.matches) setIntro(false);
    };
    reduced.addEventListener("change", motionChange);
    return () => {
      cancelAnimationFrame(frame);
      if (nextFrame) cancelAnimationFrame(nextFrame);
      clearTimeout(timer);
      reduced.removeEventListener("change", motionChange);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const open = useCallback(
    (screen: Screen, options: ViewOptions = {}) => {
      setIntro(false);
      dispatch({ type: "open", screen, ...options });
    },
    [dispatch],
  );
  const home = useCallback(() => open("main"), [open]);
  const back = useCallback(() => {
    setIntro(false);
    dispatch({ type: "back" });
  }, [dispatch]);
  const changePage = useCallback(
    (delta: number) => dispatch({ type: "page", delta, count: 2 }),
    [dispatch],
  );
  const move = useCallback(
    (delta: number, paginate = false) => {
      setIntro(false);
      if (entries.length)
        dispatch({ type: "move", delta, count: entries.length });
      else if (nav.screen === "about" && paginate) changePage(delta);
      else
        document.querySelector(".lcd-content")?.scrollBy({
          top: delta * 55,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
    },
    [entries.length, nav.screen, dispatch, changePage],
  );
  const activate = useCallback(
    (index: number) => {
      setIntro(false);
      const entry = entries[index];
      if (!entry) {
        if (nav.screen === "about") changePage(1);
        else move(1);
        return;
      }
      const action = entry.action;
      if (action.type === "open") open(action.screen, action);
      else if (action.type === "language") {
        setLang(action.language);
        safelyStore(LANGUAGE_KEY, action.language);
      } else if (action.type === "external")
        window.open(action.href, "_blank", "noopener,noreferrer");
      else {
        const link = document.createElement("a");
        link.href = action.href;
        link.download = "";
        link.click();
      }
    },
    [entries, nav.screen, open, changePage, move],
  );
  const select = useCallback(
    () => activate(nav.selected),
    [activate, nav.selected],
  );
  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('input,textarea,select,[contenteditable="true"]'))
        return;
      if (!target.closest(".device") && target !== document.body) return;
      if (target === document.body) {
        const r = document.querySelector(".device")?.getBoundingClientRect();
        if (!r || r.bottom < 0 || r.top > innerHeight) return;
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        move(
          e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1,
          e.key === "ArrowLeft" || e.key === "ArrowRight",
        );
      } else if (
        (e.key === "Enter" || e.key === " ") &&
        (!target.closest("button,a") || target.closest(".lcd-row"))
      ) {
        e.preventDefault();
        select();
      } else if (
        (e.key === "Escape" || e.key === "Backspace") &&
        nav.history.length
      ) {
        e.preventDefault();
        back();
      } else if (e.key === "Home") {
        e.preventDefault();
        home();
      }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [move, select, back, home, nav.history.length]);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Artsiom Makarevich",
    jobTitle: "Frontend Developer",
    url: siteUrl,
    sameAs: [contact.github, contact.linkedin],
    knowsAbout: ["React", "TypeScript", "JavaScript", "Next.js"],
    subjectOf: projects.map((p) => ({
      "@type": "SoftwareSourceCode",
      name: p.title,
      codeRepository: p.repo,
      description: p.description.en,
      programmingLanguage: p.stack,
    })),
  };
  return (
    <main className="exhibition" lang={lang}>
      <div className="identity">
        <div className="identity-mark" aria-hidden="true">
          am<span>.</span>
        </div>
        <h1>{t.name}</h1>
        <p className="identity-role">{t.role}</p>
        <p className="identity-tagline">{t.tagline}</p>
      </div>
      <p className="sr-only">{t.screenReaderIntro}</p>
      <Device
        nav={nav}
        t={t}
        lang={lang}
        intro={intro}
        entries={entries}
        skip={() => setIntro(false)}
        move={move}
        back={back}
        home={home}
        select={select}
        highlight={(index) => dispatch({ type: "highlight", index })}
        activate={activate}
        page={changePage}
        recordScroll={(position) => dispatch({ type: "scroll", position })}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
