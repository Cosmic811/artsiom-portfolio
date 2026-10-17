"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type PointerEvent,
} from "react";
import {
  BatteryFull,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { Dictionary, Language } from "@/content/i18n";
import type { Navigation } from "@/hooks/useNavigation";
import type { MenuEntry } from "@/lib/menu";
import { screenTitle } from "@/lib/menu";
import { useClickWheel } from "@/hooks/useClickWheel";
import { ScreenContent } from "./ScreenContent";
interface Props {
  nav: Navigation;
  t: Dictionary;
  lang: Language;
  intro: boolean;
  entries: MenuEntry[];
  skip: () => void;
  move: (direction: number, paginate?: boolean) => void;
  back: () => void;
  home: () => void;
  select: () => void;
  highlight: (index: number) => void;
  activate: (index: number) => void;
  page: (delta: number) => void;
  recordScroll: (position: number) => void;
}
export function Device({
  nav,
  t,
  lang,
  intro,
  entries,
  skip,
  move,
  back,
  home,
  select,
  highlight,
  activate,
  page,
  recordScroll,
}: Props) {
  const wheel = useClickWheel(move);
  const { dragging, ...wheelHandlers } = wheel;
  const screenRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLElement>(null);
  const tiltFrame = useRef<number | null>(null);
  const viewKey = [
    nav.screen,
    nav.project,
    nav.group,
    nav.skill,
    nav.page,
    lang,
  ].join(":");
  const previousView = useRef(viewKey);
  const title = screenTitle(nav, t);
  const syncScrollIndicator = useCallback(() => {
    const screen = screenRef.current,
      track = scrollTrackRef.current,
      thumb = scrollThumbRef.current;
    if (!screen || !track || !thumb) return;
    const overflow = screen.scrollHeight - screen.clientHeight;
    track.hidden = overflow <= 1;
    if (overflow <= 1) return;
    const trackHeight = track.clientHeight;
    const thumbHeight = Math.max(
      16,
      (trackHeight * screen.clientHeight) / screen.scrollHeight,
    );
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${(Math.max(0, screen.scrollTop) / overflow) * (trackHeight - thumbHeight)}px)`;
  }, []);
  useLayoutEffect(() => {
    syncScrollIndicator();
    const screen = screenRef.current;
    if (!screen) return;
    const observer = new ResizeObserver(syncScrollIndicator);
    observer.observe(screen);
    if (screen.firstElementChild) observer.observe(screen.firstElementChild);
    if (screen.lastElementChild) observer.observe(screen.lastElementChild);
    return () => observer.disconnect();
  }, [viewKey, syncScrollIndicator]);
  useEffect(
    () => () => {
      if (tiltFrame.current !== null) cancelAnimationFrame(tiltFrame.current);
    },
    [],
  );
  useLayoutEffect(() => {
    if (previousView.current === viewKey) return;
    previousView.current = viewKey;
    const screen = screenRef.current;
    if (!screen) return;
    screen.scrollTop = nav.scroll;
    const selected = screen.querySelector<HTMLElement>(".is-selected");
    (selected ?? screen).focus({ preventScroll: true });
  }, [viewKey, nav.scroll]);
  useEffect(() => {
    const screen = screenRef.current;
    const row = screen?.querySelector<HTMLElement>(".is-selected");
    if (!screen || !row) return;
    if (row.offsetTop < screen.scrollTop) screen.scrollTop = row.offsetTop;
    else if (
      row.offsetTop + row.offsetHeight >
      screen.scrollTop + screen.clientHeight
    )
      screen.scrollTop = row.offsetTop + row.offsetHeight - screen.clientHeight;
  }, [nav.selected]);
  function resetTilt() {
    if (tiltFrame.current !== null) cancelAnimationFrame(tiltFrame.current);
    deviceRef.current?.style.setProperty("--tilt-x", "0deg");
    deviceRef.current?.style.setProperty("--tilt-y", "0deg");
  }
  function tilt(e: PointerEvent<HTMLElement>) {
    if (
      e.pointerType !== "mouse" ||
      dragging ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - r.top) / r.height - 0.5) * -2;
    const y = ((e.clientX - r.left) / r.width - 0.5) * 2;
    if (tiltFrame.current !== null) cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current = requestAnimationFrame(() => {
      deviceRef.current?.style.setProperty("--tilt-x", `${x}deg`);
      deviceRef.current?.style.setProperty("--tilt-y", `${y}deg`);
      tiltFrame.current = null;
    });
  }
  return (
    <div className="device-stage">
      <div className="contact-shadow" aria-hidden="true" />
      <section
        ref={deviceRef}
        className={`device ${intro ? "booting" : ""}`}
        aria-label={t.screenLabel}
        onPointerMove={tilt}
        onPointerLeave={resetTilt}
      >
        <div className="hold-switch" aria-hidden="true">
          <i />
        </div>
        <div className="body-seam" aria-hidden="true" />
        <div className="screen-bezel">
          <div className="lcd">
            <div className="lcd-status">
              <span>ARTSIOM</span>
              <BatteryFull size={21} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="lcd-heading">
              <span>
                {nav.screen !== "main" && (
                  <ChevronLeft size={12} aria-hidden="true" />
                )}
                {title}
              </span>
              <span className="lcd-counter">
                {entries.length
                  ? `${nav.selected + 1}/${entries.length}`
                  : nav.screen === "about"
                    ? `${nav.page + 1}/2`
                    : ""}
              </span>
            </div>
            <div
              ref={screenRef}
              className="lcd-content"
              role="region"
              aria-label={title}
              tabIndex={-1}
              key={viewKey}
              inert={intro}
              onScroll={(e) => {
                syncScrollIndicator();
                recordScroll(e.currentTarget.scrollTop);
              }}
            >
              <ScreenContent
                nav={nav}
                t={t}
                lang={lang}
                entries={entries}
                activate={activate}
                highlight={highlight}
                page={page}
              />
            </div>
            <div
              ref={scrollTrackRef}
              className="lcd-scrollbar"
              aria-hidden="true"
              hidden
            >
              <i ref={scrollThumbRef} />
            </div>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {title}.{" "}
              {entries.length
                ? `${t.position} ${nav.selected + 1} ${t.of} ${entries.length}: ${entries[nav.selected]?.label}`
                : nav.screen === "about"
                  ? `${t.page} ${nav.page + 1} ${t.of} 2`
                  : t.scroll}
            </span>
            <div
              className={`boot-screen ${intro ? "is-booting" : ""}`}
              aria-hidden={!intro}
            >
              <span className="boot-mark">
                am<span>.</span>
              </span>
              <span className="boot-progress" />
              <p>{t.starting}</p>
              <button onClick={skip} tabIndex={intro ? 0 : -1}>
                {t.skip}
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        </div>
        <div
          className={`click-wheel ${dragging ? "is-dragging" : ""}`}
          {...wheelHandlers}
          role="group"
          aria-label={t.wheel}
        >
          <button
            className="wheel-control wheel-menu"
            aria-label={t.back}
            title={t.back}
            onClick={back}
          >
            MENU
          </button>
          <button
            className="wheel-control wheel-prev"
            aria-label={t.previous}
            title={t.previous}
            onClick={() => move(-1, true)}
          >
            <ChevronsLeft size={24} fill="currentColor" strokeWidth={1} />
          </button>
          <button
            className="wheel-control wheel-next"
            aria-label={t.next}
            title={t.next}
            onClick={() => move(1, true)}
          >
            <ChevronsRight size={24} fill="currentColor" strokeWidth={1} />
          </button>
          <button
            className="wheel-control wheel-home"
            aria-label={t.home}
            title={t.home}
            onClick={home}
          >
            <span className="home-mark" aria-hidden="true">
              HOME
            </span>
          </button>
          <button
            className="wheel-center"
            aria-label={t.select}
            title={t.select}
            onClick={select}
          >
            <span />
          </button>
        </div>
        <div className="device-engraving" aria-hidden="true">
          AM · PORTFOLIO EDITION
        </div>
      </section>
      <p className="device-instruction">
        {t.instruction}
        <span>{t.keys}</span>
      </p>
    </div>
  );
}
