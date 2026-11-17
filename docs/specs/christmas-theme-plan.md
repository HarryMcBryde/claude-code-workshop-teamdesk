# Christmas theme: implementation plan

Spec: [christmas-theme.md](christmas-theme.md). Three phases, one commit each.

## Phase 1: Theme mode and palette
- Add the `.christmas` variable block to `apps/web/src/styles.css`: snow
  background, holly-green text, red accent, AA contrast.
- Add `christmas` to `theme-toggle.tsx`: type, cycle order, label, snowflake
  icon, class handling in `applyThemeMode`.
- Update `THEME_INIT_SCRIPT` in `routes/__root.tsx` so a saved choice loads
  without a flash.
- Toaster: `use-resolved-theme.ts` already returns "light" when `<html>` has
  no `dark` class, so Christmas needs no change there.

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
