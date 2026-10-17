import { contact, projects, skillGroups } from "../content/portfolio";
import type { Dictionary, Language } from "../content/i18n";
import type { Navigation, Screen, ViewOptions } from "../hooks/useNavigation";
import { assetPath } from "./site";
export type MenuAction =
  | ({ type: "open"; screen: Screen } & ViewOptions)
  | { type: "external"; href: string }
  | { type: "download"; href: string }
  | { type: "language"; language: Language };
export interface MenuEntry {
  id: string;
  label: string;
  action: MenuAction;
  meta?: string;
  checked?: boolean;
}
export function skillsForGroup(
  group: number,
  t: Dictionary,
): readonly string[] {
  return group === 3 ? t.creative : (skillGroups[group] ?? []);
}
export function relatedProjects(nav: Navigation, t: Dictionary) {
  const label = skillsForGroup(nav.group, t)[nav.skill];
  if (nav.group === 3) return [0];
  if (
    [
      "JavaScript",
      "TypeScript",
      "React",
      "HTML",
      "CSS",
      "Git",
      "GitHub",
    ].includes(label)
  )
    return projects.map((_, i) => i);
  if (label === "Tailwind CSS") return [0, 1, 4];
  if (label === "REST APIs") return [1, 2, 3, 4];
  if (label === "Docker") return [1];
  if (label === "CI/CD") return [0];
  return projects.flatMap((p, i) => (p.stack.includes(label) ? [i] : []));
}
export function getMenu(
  nav: Navigation,
  t: Dictionary,
  lang: Language,
): MenuEntry[] {
  const open = (
    id: string,
    label: string,
    screen: Screen,
    options: ViewOptions = {},
  ): MenuEntry => ({ id, label, action: { type: "open", screen, ...options } });
  if (nav.screen === "main")
    return [
      open("about", t.menu[0], "about"),
      open("projects", t.menu[1], "projects"),
      open("skills", t.menu[2], "skills"),
      open("experience", t.menu[3], "experience"),
      open("contact", t.menu[4], "contact"),
      open("resume", t.menu[5], "resume"),
      {
        id: "github",
        label: "GitHub",
        action: { type: "external", href: contact.github },
      },
      open("settings", t.menu[7], "settings"),
    ];
  if (nav.screen === "projects")
    return projects.map((p, i) => ({
      ...open(p.id, p.title, "project", { project: i }),
      meta: String(i + 1).padStart(2, "0"),
    }));
  if (nav.screen === "project") {
    const p = projects[nav.project];
    return [
      open("overview", t.projectMenu[0], "project-overview"),
      open("technologies", t.projectMenu[1], "project-stack"),
      open("highlights", t.projectMenu[2], "project-highlights"),
      {
        id: "source",
        label: t.github,
        action: { type: "external", href: p.repo },
      },
      ...(p.live
        ? [
            {
              id: "demo",
              label: t.live,
              action: { type: "external" as const, href: p.live },
            },
          ]
        : []),
    ];
  }
  if (nav.screen === "skills")
    return t.groups.map((label, i) =>
      open(String(i), label, "skill", { group: i }),
    );
  if (nav.screen === "skill")
    return skillsForGroup(nav.group, t).map((label, i) =>
      open(label, label, "skill-detail", { skill: i }),
    );
  if (nav.screen === "skill-detail")
    return [
      ...relatedProjects(nav, t).map((i) =>
        open(projects[i].id, projects[i].title, "project", { project: i }),
      ),
      {
        id: "github",
        label: t.github,
        action: { type: "external", href: contact.github },
      },
    ];
  if (nav.screen === "contact")
    return [
      {
        id: "github",
        label: t.github,
        action: { type: "external", href: contact.github },
      },
      {
        id: "linkedin",
        label: t.linkedin,
        action: { type: "external", href: contact.linkedin },
      },
      ...(contact.telegram
        ? [
            {
              id: "telegram",
              label: t.telegram,
              action: { type: "external" as const, href: contact.telegram },
            },
          ]
        : []),
      ...(contact.email
        ? [
            {
              id: "email",
              label: t.email,
              action: {
                type: "external" as const,
                href: `mailto:${contact.email}`,
              },
            },
          ]
        : []),
    ];
  if (nav.screen === "resume")
    return [
      ...(contact.resume
        ? [
            {
              id: "pdf",
              label: t.download,
              action: {
                type: "download" as const,
                href: assetPath(contact.resume),
              },
            },
          ]
        : []),
      open("experience", t.menu[3], "experience"),
      {
        id: "linkedin",
        label: t.linkedin,
        action: { type: "external", href: contact.linkedin },
      },
    ];
  if (nav.screen === "settings")
    return [open("language", t.language, "language")];
  if (nav.screen === "language")
    return t.languageOptions.map((label, i) => ({
      id: label,
      label,
      action: { type: "language", language: i === 0 ? "en" : "ru" },
      checked: lang === (i === 0 ? "en" : "ru"),
    }));
  return [];
}
export function screenTitle(nav: Navigation, t: Dictionary) {
  if (nav.screen === "project") return projects[nav.project].title;
  if (nav.screen === "project-overview") return t.overview;
  if (nav.screen === "project-stack") return t.technologies;
  if (nav.screen === "project-highlights") return t.highlights;
  if (nav.screen === "skill") return t.groups[nav.group];
  if (nav.screen === "skill-detail")
    return skillsForGroup(nav.group, t)[nav.skill];
  if (nav.screen === "language") return t.language;
  if (nav.screen === "main") return t.main;
  const ids = [
    "about",
    "projects",
    "skills",
    "experience",
    "contact",
    "resume",
    "github",
    "settings",
  ];
  return t.menu[ids.indexOf(nav.screen)] ?? t.main;
}
