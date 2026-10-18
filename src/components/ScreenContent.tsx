"use client";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { experienceTechnologies, projects } from "@/content/portfolio";
import type { Dictionary, Language } from "@/content/i18n";
import type { Navigation } from "@/hooks/useNavigation";
import type { MenuEntry } from "@/lib/menu";
interface Props {
  nav: Navigation;
  t: Dictionary;
  lang: Language;
  entries: MenuEntry[];
  activate: (index: number) => void;
  highlight: (index: number) => void;
  page: (delta: number) => void;
}
export function ScreenContent({
  nav,
  t,
  lang,
  entries,
  activate,
  highlight,
  page,
}: Props) {
  const menu = (
    <nav
      className={`lcd-menu${nav.screen === "project" ? " lcd-menu--project" : ""}`}
      aria-label={t.screen}
    >
      {entries.map((entry, i) => {
        const contents = (
          <>
            <span className="selection-marker" aria-hidden="true">
              ›
            </span>
            {entry.meta && <span className="row-number">{entry.meta}</span>}
            <span className="row-label">{entry.label}</span>
            {entry.checked ? (
              <Check
                className="row-end"
                size={13}
                aria-label={t.selectedLanguage}
              />
            ) : entry.action.type === "external" ? (
              <ArrowUpRight className="row-end" size={13} aria-hidden="true" />
            ) : (
              <ChevronRight className="row-end" size={13} aria-hidden="true" />
            )}
          </>
        );
        const props = {
          className: `lcd-row ${nav.selected === i ? "is-selected" : ""}${nav.screen === "project" && entry.action.type === "external" ? ` project-quick-link${!projects[nav.project].live ? " project-quick-link--wide" : ""}` : ""}`,
          onFocus: () => highlight(i),
          onPointerMove: () => highlight(i),
          "aria-current": nav.selected === i ? ("true" as const) : undefined,
        };
        return entry.action.type === "external" ||
          entry.action.type === "download" ? (
          <a
            key={entry.id}
            {...props}
            href={entry.action.href}
            target={entry.action.type === "external" ? "_blank" : undefined}
            rel="noopener noreferrer"
            download={entry.action.type === "download" || undefined}
            aria-label={`${entry.label}${entry.action.type === "external" ? ` (${t.newTab})` : ""}`}
          >
            {contents}
          </a>
        ) : (
          <button
            key={entry.id}
            {...props}
            onClick={() => activate(i)}
            aria-pressed={
              entry.action.type === "language" ? entry.checked : undefined
            }
          >
            {contents}
          </button>
        );
      })}
    </nav>
  );
  if (
    nav.screen === "main" ||
    nav.screen === "projects" ||
    nav.screen === "skills" ||
    nav.screen === "skill" ||
    nav.screen === "settings" ||
    nav.screen === "language" ||
    nav.screen === "contact"
  )
    return menu;
  if (nav.screen === "project")
    return (
      <>
        <article className="project-summary">
          <p>{projects[nav.project].description[lang]}</p>
          <p className="project-core-stack" aria-label={t.technologies}>
            {projects[nav.project].stack.slice(0, 3).join(" · ")}
          </p>
        </article>
        {menu}
      </>
    );
  if (nav.screen === "skill-detail")
    return (
      <>
        <p className="lcd-category">
          {entries.length > 1 ? t.related : t.supporting}
        </p>
        {menu}
      </>
    );
  if (nav.screen === "resume")
    return (
      <>
        <article className="lcd-article">
          <h2>{t.resumeRole}</h2>
          <p className="lcd-eyebrow">{t.resumeFormat}</p>
        </article>
        {menu}
      </>
    );
  if (nav.screen === "about")
    return (
      <article className="lcd-article about-page">
        <span className="lcd-monogram" aria-hidden="true">
          am.
        </span>
        <h2>{nav.page === 0 ? t.aboutTitle : t.approachTitle}</h2>
        <p>{nav.page === 0 ? t.about : t.approach}</p>
        <div className="lcd-pager">
          <button aria-label={t.previousPage} onClick={() => page(-1)}>
            <ChevronLeft size={14} />
          </button>
          <span>
            {t.page} {nav.page + 1} / 2
          </span>
          <button aria-label={t.nextPage} onClick={() => page(1)}>
            <ChevronRight size={14} />
          </button>
        </div>
      </article>
    );
  if (nav.screen === "experience")
    return (
      <article className="lcd-article lcd-experience">
        <h2>{t.experienceTitle}</h2>
        <strong className="lcd-company">{t.company}</strong>
        <p className="lcd-eyebrow">{t.dates}</p>
        <section>
          <h3>{t.technologies}</h3>
          <p>{experienceTechnologies.join(" · ")}</p>
        </section>
        <section>
          <h3>{t.responsibilities}</h3>
          <ul className="experience-responsibilities">
            {t.experienceResponsibilities.map((responsibility) => (
              <li key={responsibility}>{responsibility}</li>
            ))}
          </ul>
        </section>
      </article>
    );
  const p = projects[nav.project];
  if (nav.screen === "project-stack")
    return (
      <article className="lcd-article">
        <span className="lcd-eyebrow">{p.title}</span>
        <ul className="lcd-stack">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </article>
    );
  return (
    <article className="lcd-article">
      <span className="lcd-eyebrow">{p.title}</span>
      <ol className="lcd-highlights">
        {p.highlights[lang].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </article>
  );
}
