import test from "node:test";
import assert from "node:assert/strict";
import {
  navigationReducer,
  initialNavigation,
} from "../src/hooks/useNavigation.ts";
import { angularDelta, WheelGesture } from "../src/lib/wheel.ts";
import {
  readPreferences,
  writePreference,
  shouldPlayIntro,
  INTRO_KEY,
  LANGUAGE_KEY,
} from "../src/lib/preferences.ts";
const initial = initialNavigation;
const bounds = { left: 0, top: 0, width: 200, height: 200 };
const pointAt = (degrees) => ({
  x: 100 + 80 * Math.cos((degrees * Math.PI) / 180),
  y: 100 + 80 * Math.sin((degrees * Math.PI) / 180),
});
test("touch-style pointer sequences cross the angular seam without skipped items", () => {
  const steps = [];
  const wheel = new WheelGesture((direction) => steps.push(direction));
  assert.equal(wheel.start(12, 0, pointAt(350), bounds), true);
  for (const degree of [355, 0, 5, 10, 15, 20])
    wheel.move(12, pointAt(degree), bounds);
  assert.deepEqual(steps, [1]);
  assert.equal(wheel.end(12), true);
  assert.equal(wheel.consumeClick(), true);
  assert.equal(wheel.consumeClick(), false);
});
test("counterclockwise touch gestures move upward", () => {
  const steps = [];
  const wheel = new WheelGesture((d) => steps.push(d));
  wheel.start(2, 0, pointAt(20), bounds);
  for (const d of [15, 10, 5, 0, 355, 350]) wheel.move(2, pointAt(d), bounds);
  assert.deepEqual(steps, [-1]);
});
test("center taps and right mouse clicks do not start wheel navigation", () => {
  const wheel = new WheelGesture(() => assert.fail("unexpected step"));
  assert.equal(wheel.start(1, 0, { x: 100, y: 100 }, bounds), false);
  assert.equal(wheel.start(1, 2, pointAt(0), bounds), false);
});
test("ordinary button taps are not suppressed", () => {
  const wheel = new WheelGesture(() => assert.fail("unexpected step"));
  wheel.start(1, 0, pointAt(0), bounds);
  wheel.end(1);
  assert.equal(wheel.consumeClick(), false);
});
test("additional fingers and cancelled gestures cannot move the menu", () => {
  const steps = [];
  const wheel = new WheelGesture((d) => steps.push(d));
  wheel.start(1, 0, pointAt(0), bounds);
  assert.equal(wheel.start(2, 0, pointAt(0), bounds), false);
  wheel.move(2, pointAt(90), bounds);
  assert.equal(wheel.end(2), false);
  wheel.cancel();
  wheel.move(1, pointAt(90), bounds);
  assert.deepEqual(steps, []);
  assert.equal(wheel.consumeClick(), false);
});
test("crossing the central button does not introduce a half-turn jump", () => {
  const steps = [];
  const wheel = new WheelGesture((d) => steps.push(d));
  wheel.start(1, 0, pointAt(0), bounds);
  wheel.move(1, { x: 100, y: 100 }, bounds);
  wheel.move(1, pointAt(180), bounds);
  assert.deepEqual(steps, []);
});
test("clockwise and counterclockwise angles cross the seam correctly", () => {
  assert.equal(angularDelta(1, 359), 2);
  assert.equal(angularDelta(359, 1), -2);
  assert.equal(angularDelta(-179, 179), 2);
  assert.equal(angularDelta(179, -179), -2);
  assert.equal(angularDelta(90, 0), 90);
  assert.equal(angularDelta(0, 90), -90);
});
test("small pointer movements accumulate without a full rotation jump", () => {
  const angles = [350, 355, 0, 5, 10, 15, 20];
  let total = 0;
  let steps = 0;
  for (let i = 1; i < angles.length; i++) {
    total += angularDelta(angles[i], angles[i - 1]);
    if (total >= 25) {
      steps++;
      total -= 25;
    }
  }
  assert.equal(steps, 1);
  assert.equal(total, 5);
});
test("menu wraps in both directions", () => {
  const last = navigationReducer(initial, {
    type: "move",
    delta: -1,
    count: 7,
  });
  assert.equal(last.selected, 6);
  assert.equal(
    navigationReducer(last, { type: "move", delta: 1, count: 7 }).selected,
    0,
  );
});
test("back restores the selected project without losing its position", () => {
  let state = navigationReducer(
    { ...initial, selected: 1 },
    { type: "open", screen: "projects" },
  );
  state = navigationReducer(state, { type: "highlight", index: 3 });
  state = navigationReducer(state, {
    type: "open",
    screen: "project",
    project: 3,
  });
  assert.equal(state.project, 3);
  assert.equal(state.selected, 0);
  state = navigationReducer(state, { type: "back" });
  assert.equal(state.screen, "projects");
  assert.equal(state.selected, 3);
  state = navigationReducer(state, { type: "back" });
  assert.equal(state.screen, "main");
  assert.equal(state.selected, 1);
});
test("back on the root is a safe no-op", () => {
  assert.equal(navigationReducer(initial, { type: "back" }), initial);
});
test("the main-menu shortcut clears history", () => {
  const state = navigationReducer(
    {
      ...initial,
      screen: "project",
      history: [{ screen: "projects", selected: 3 }],
    },
    { type: "open", screen: "main" },
  );
  assert.equal(state.screen, "main");
  assert.equal(state.history.length, 0);
  assert.equal(navigationReducer(state, { type: "back" }).screen, "main");
});
test("skill groups keep their navigation context", () => {
  const state = navigationReducer(
    { ...initial, screen: "skills", selected: 2 },
    { type: "open", screen: "skill", group: 2 },
  );
  assert.equal(state.group, 2);
  assert.equal(navigationReducer(state, { type: "back" }).selected, 2);
});
test("first visit plays intro; refresh and a new session do not", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(shouldPlayIntro(readPreferences(storage).seen, false), true);
  writePreference(storage, INTRO_KEY, "seen");
  assert.equal(shouldPlayIntro(readPreferences(storage).seen, false), false);
  const nextSession = {
    getItem: (key) => values.get(key) ?? null,
    setItem: storage.setItem,
  };
  assert.equal(
    shouldPlayIntro(readPreferences(nextSession).seen, false),
    false,
  );
});
test("reduced motion skips the intro even on a first visit", () => {
  assert.equal(shouldPlayIntro(false, true), false);
  assert.equal(shouldPlayIntro(true, true), false);
});
test("language survives preferences reconstruction", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  writePreference(storage, LANGUAGE_KEY, "ru");
  assert.equal(readPreferences(storage).language, "ru");
  writePreference(storage, LANGUAGE_KEY, "unknown");
  assert.equal(readPreferences(storage).language, "en");
});
test("blocked storage degrades to safe defaults and never throws", () => {
  const blocked = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("denied");
    },
  };
  assert.deepEqual(readPreferences(blocked), { seen: false, language: "en" });
  assert.doesNotThrow(() => writePreference(blocked, "am:intro", "seen"));
});

test("a direct chord across the center is ignored even without a sampled center point", () => {
  const steps = [];
  const wheel = new WheelGesture((d) => steps.push(d));
  wheel.start(1, 0, pointAt(0), bounds);
  wheel.move(1, pointAt(180), bounds);
  assert.deepEqual(steps, []);
});
test("back restores the complete skill and project context, including scroll", () => {
  let state = {
    ...initial,
    screen: "skill-detail",
    group: 2,
    skill: 3,
    selected: 2,
    scroll: 73,
  };
  state = navigationReducer(state, {
    type: "open",
    screen: "project",
    project: 2,
  });
  state = navigationReducer(state, { type: "highlight", index: 2 });
  state = navigationReducer(state, {
    type: "open",
    screen: "project-highlights",
  });
  state = navigationReducer(state, { type: "scroll", position: 91 });
  state = navigationReducer(state, { type: "back" });
  assert.equal(state.screen, "project");
  assert.equal(state.project, 2);
  assert.equal(state.selected, 2);
  state = navigationReducer(state, { type: "back" });
  assert.equal(state.screen, "skill-detail");
  assert.equal(state.group, 2);
  assert.equal(state.skill, 3);
  assert.equal(state.scroll, 73);
});
test("about pages wrap and clear obsolete scroll offsets", () => {
  const state = navigationReducer(
    { ...initial, screen: "about", scroll: 40 },
    { type: "page", delta: -1, count: 2 },
  );
  assert.equal(state.page, 1);
  assert.equal(state.scroll, 0);
});
test("legacy preferences migrate without replaying startup", () => {
  const storage = {
    getItem: (key) =>
      ({ "am:intro": "seen", "am:language": "ru" })[key] ?? null,
    setItem() {},
  };
  assert.deepEqual(readPreferences(storage), { seen: true, language: "ru" });
  assert.equal(INTRO_KEY, "am:intro:v1");
  assert.equal(LANGUAGE_KEY, "am:language:v1");
});
