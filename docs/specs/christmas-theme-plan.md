# Christmas theme: implementation plan

Spec: [christmas-theme.md](christmas-theme.md). Three phases, one commit each.

## Phase 1: Theme mode and palette
- Add the `.christmas` variable block to `apps/web/src/styles.css`: spruce
  green night background (originally snow-white), ivory text, red accent, AA
  contrast.
- Add `christmas` to `theme-toggle.tsx`: type, cycle order, label, snowflake
  icon, class handling in `applyThemeMode`.
- Update `THEME_INIT_SCRIPT` in `routes/__root.tsx` so a saved choice loads
  without a flash.
- Toaster: `use-resolved-theme.ts` reads the `dark` class, so Christmas
  (which now carries `dark`) gives a dark toaster with no code change.

Done when: the toggle cycles all four modes, Christmas survives a reload, and
light, dark and auto are unchanged.

## Phase 2: Decoration
- Festive mark in `header.tsx`, shown only in Christmas mode.
- `snowfall.tsx`: 30 CSS flakes, fixed, `pointer-events: none`, no dependency.
- Mount it in `__root.tsx`; hide it under `prefers-reduced-motion`.

Done when: snow falls behind content, clicks pass through, and it is absent in
other modes and with reduced motion on.

## Phase 3: Verify and finish
- Unit tests for the theme logic (mode cycle, resolution, init script).
- Browser check of every mode, contrast, reload flash, toast, snow.
- Lint with Biome and typecheck.
- `bun test` passes.

Done when: the spec's acceptance checks all pass.

## Phase 4: festive redesign
The near-white snow look was not festive and the white flakes were invisible
on it. Christmas is now a deep evergreen night theme:
- Palette: spruce background with a gentle gradient, ivory text, lighter
  green cards with gold-tinted borders, red primary, gold secondary accent.
- Christmas is a dark-scheme theme: `<html>` gets `dark christmas`, and
  `color-scheme: dark`. `resolveTheme("christmas")` returns `dark`;
  `THEME_INIT_SCRIPT` and `applyThemeMode` are kept in sync. The `.christmas`
  block sits after `.dark` and overrides every variable.
- Decoration: candy-cane strip under the sticky header, gold-glow tree mark,
  gold sparkle on kickers, and brighter, larger, varied snow (36 flakes,
  3 to 9px, glow and blur), still `pointer-events: none` and hidden under
  `prefers-reduced-motion`.
- Tests updated: Christmas resolves to `dark`; the init script gives classes
  `dark` and `christmas` with `color-scheme: dark`.

Done when: screenshots look festive and legible at desktop and 390px, contrast
passes AA, reload shows no non-festive frame, and the checks pass.
