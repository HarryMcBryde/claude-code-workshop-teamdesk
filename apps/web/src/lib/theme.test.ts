import { describe, expect, test } from "bun:test";
import {
  NEXT_MODE,
  parseThemeMode,
  resolveTheme,
  THEME_INIT_SCRIPT,
  type ThemeMode,
} from "./theme";

function runInitScript(stored: string | null, prefersDark: boolean) {
  const classes = new Set<string>(["light"]);
  const attrs = new Map<string, string>();
  const style = { colorScheme: "" };
  const documentElement = {
    classList: {
      add: (...c: string[]) => {
        for (const x of c) {
          classes.add(x);
        }
      },
      remove: (...c: string[]) => {
        for (const x of c) {
          classes.delete(x);
        }
      },
    },
    removeAttribute: (n: string) => {
      attrs.delete(n);
    },
    setAttribute: (n: string, v: string) => {
      attrs.set(n, v);
    },
    style,
  };
  const g = globalThis as Record<string, unknown>;
  const prev = { document: g.document, window: g.window };
  g.window = {
    localStorage: { getItem: () => stored },
    matchMedia: () => ({ matches: prefersDark }),
  };
  g.document = { documentElement };
  try {
    new Function(THEME_INIT_SCRIPT)();
  } finally {
    g.window = prev.window;
    g.document = prev.document;
  }
  return { attrs, classes: [...classes], colorScheme: style.colorScheme };
}

describe("theme cycle", () => {
  test("auto -> light -> dark -> christmas -> auto", () => {
    const order: ThemeMode[] = [];
    let mode: ThemeMode = "auto";
    for (const _ of [1, 2, 3, 4]) {
      mode = NEXT_MODE[mode];
      order.push(mode);
    }
    expect(order).toEqual(["light", "dark", "christmas", "auto"]);
  });
});

describe("resolveTheme", () => {
  test("christmas resolves to dark regardless of system", () => {
    expect(resolveTheme("christmas", true)).toBe("dark");
    expect(resolveTheme("christmas", false)).toBe("dark");
  });
  test("light, dark and auto are unchanged", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("auto", true)).toBe("dark");
    expect(resolveTheme("auto", false)).toBe("light");
  });
});

describe("parseThemeMode", () => {
  test("valid values pass through", () => {
    for (const m of ["light", "dark", "auto", "christmas"] as const) {
      expect(parseThemeMode(m)).toBe(m);
    }
  });
  test("unknown, null and undefined fall back to auto", () => {
    expect(parseThemeMode("purple")).toBe("auto");
    expect(parseThemeMode("")).toBe("auto");
    expect(parseThemeMode(null)).toBe("auto");
    expect(parseThemeMode(undefined)).toBe("auto");
  });
});

describe("THEME_INIT_SCRIPT", () => {
  test("christmas: classes dark + christmas, data-theme, dark colour scheme", () => {
    for (const prefersDark of [true, false]) {
      const r = runInitScript("christmas", prefersDark);
      expect(r.classes).toEqual(["dark", "christmas"]);
      expect(r.attrs.get("data-theme")).toBe("christmas");
      expect(r.colorScheme).toBe("dark");
    }
  });
  test("light", () => {
    const r = runInitScript("light", true);
    expect(r.classes).toEqual(["light"]);
    expect(r.attrs.get("data-theme")).toBe("light");
    expect(r.colorScheme).toBe("light");
  });
  test("dark", () => {
    const r = runInitScript("dark", false);
    expect(r.classes).toEqual(["dark"]);
    expect(r.attrs.get("data-theme")).toBe("dark");
    expect(r.colorScheme).toBe("dark");
  });
  test("auto follows system and sets no data-theme", () => {
    const d = runInitScript("auto", true);
    expect(d.classes).toEqual(["dark"]);
    expect(d.attrs.has("data-theme")).toBe(false);
    expect(d.colorScheme).toBe("dark");
    const l = runInitScript("auto", false);
    expect(l.classes).toEqual(["light"]);
    expect(l.colorScheme).toBe("light");
  });
  test("missing or unknown stored value behaves as auto", () => {
    expect(runInitScript(null, true).classes).toEqual(["dark"]);
    expect(runInitScript("bogus", false).classes).toEqual(["light"]);
  });
});
