"use client";
import { useReducer } from "react";
export type Screen =
  | "main"
  | "about"
  | "projects"
  | "project"
  | "project-stack"
  | "project-highlights"
  | "skills"
  | "skill"
  | "skill-detail"
  | "experience"
  | "contact"
  | "resume"
  | "settings"
  | "language";
export interface ViewState {
  screen: Screen;
  selected: number;
  project: number;
  group: number;
  skill: number;
  page: number;
  scroll: number;
}
export interface Navigation extends ViewState {
  history: ViewState[];
}
export type ViewOptions = Partial<
  Pick<ViewState, "project" | "group" | "skill">
>;
export type Action =
  | { type: "move"; delta: number; count: number }
  | ({ type: "open"; screen: Screen } & ViewOptions)
  | { type: "back" }
  | { type: "highlight"; index: number }
  | { type: "scroll"; position: number }
  | { type: "page"; delta: number; count: number };
export const initialNavigation: Navigation = {
  screen: "main",
  selected: 0,
  project: 0,
  group: 0,
  skill: 0,
  page: 0,
  scroll: 0,
  history: [],
};
export function navigationReducer(
  state: Navigation,
  action: Action,
): Navigation {
  if (action.type === "move") {
    if (action.count < 1) return state;
    return {
      ...state,
      selected:
        (((state.selected + action.delta) % action.count) + action.count) %
        action.count,
    };
  }
  if (action.type === "highlight")
    return state.selected === action.index
      ? state
      : { ...state, selected: action.index };
  if (action.type === "scroll")
    return state.scroll === action.position
      ? state
      : { ...state, scroll: action.position };
  if (action.type === "page")
    return {
      ...state,
      page:
        (((state.page + action.delta) % action.count) + action.count) %
        action.count,
      scroll: 0,
    };
  if (action.type === "back") {
    const previous = state.history.at(-1);
    return previous
      ? { ...previous, history: state.history.slice(0, -1) }
      : state;
  }
  if (action.screen === "main") return { ...initialNavigation };
  const { history, ...view } = state;
  return {
    ...view,
    screen: action.screen,
    selected: 0,
    page: 0,
    scroll: 0,
    project: action.project ?? state.project,
    group: action.group ?? state.group,
    skill: action.skill ?? state.skill,
    history: [...history, view],
  };
}
export function useNavigation() {
  return useReducer(navigationReducer, initialNavigation);
}
