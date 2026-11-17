# Christmas theme

Status: built; redesigned as a festive evergreen night (see Phase 4 in the plan).

## Goal

Add a "Christmas" option to the existing theme toggle. The default look
(terracotta and paper, light and dark) stays exactly as it is. Christmas is
opt-in and easy to remove in January.

## Decisions (from interview)

- **Additive, not a replacement.** Christmas is a third theme mode.
- **Light decoration, not colours only.** Palette, a festive header mark and a
  light snowfall animation. No decoration on cards or the footer.
- **One fixed palette.** Christmas does not follow the system light/dark
  preference. It is a single festive look: a deep evergreen night with ivory
  text, Christmas red and gold.
- **A dark-scheme theme.** Christmas reuses the dark machinery (`dark` class,
  `color-scheme: dark`) and layers its own palette on top.

## Behaviour

1. The theme toggle cycles `auto -> light -> dark -> christmas -> auto`.
   Label "Christmas", with a snowflake or tree icon from `lucide-react`.
2. Choosing Christmas is saved in `localStorage` under the existing `theme`
   key (new value `christmas`) and restored on reload without a flash. The
   inline `THEME_INIT_SCRIPT` in `routes/__root.tsx` must accept it.
3. In Christmas mode:
   - `<html>` gets classes `dark christmas`, `data-theme="christmas"` and
     `color-scheme: dark`. Switching away removes both `dark` and
     `christmas` first. `THEME_INIT_SCRIPT` and `applyThemeMode` stay in sync.
   - The palette comes from a `.christmas` block in `styles.css`, placed after
     the `.dark` block so it overrides it, and sets every variable `.dark`
     sets (`--background`, `--foreground`, `--card*`, `--popover*`,
     `--primary*`, `--secondary*`, `--muted*`, `--accent*`, `--destructive`,
     `--border`, `--input`, `--ring`, `--chart-1..5`, `--sidebar*`,
     `--brand-label`).
   - Palette: deep spruce background (about `oklch(0.27 0.07 155)`, with a
     subtle vertical gradient to slightly darker on `body`), ivory text,
     cards one step lighter green with a gold-tinted border, Christmas red
     primary (`oklch(0.55 0.2 27)`, ivory text on it), warm gold
     (`oklch(0.82 0.14 85)`) for the focus ring, charts, nav underline and
     sparkles, and a light rose (`--brand-label`) for small kicker text.
     Body text, muted text, primary button text, kicker labels, nav links and
     input text must pass WCAG AA (4.5:1; 3:1 for UI borders).
   - The header dot next to "Teamdesk" becomes a tree emoji with a warm gold
     glow, shown only in Christmas mode.
   - A candy-cane (red and white diagonal stripe) strip runs along the bottom
     edge of the sticky header, and the headline kicker gets a gold sparkle.
   - A snowfall animation sits over the page background.
4. Snowfall:
   - Pure CSS or a small React component, no new dependency.
   - A fixed, full-viewport layer with `pointer-events: none` and a low
     `z-index`, so it never blocks clicks or covers text.
   - A modest number of flakes (36) so it stays cheap, in varied sizes
     (3 to 9px), bright white, with a soft glow on some and a blur on others
     so it reads clearly against the green.
   - Disabled entirely under `prefers-reduced-motion: reduce`.
   - Rendered only while Christmas mode is active.
5. Other modes are unchanged. Because Christmas carries the `dark` class,
   the `dark` custom variant (`&:is(.dark *)`) and shadcn dark styles apply;
   the `.christmas` variables override the dark palette.

## Files likely touched

- `apps/web/src/styles.css`: `.christmas` palette block, snowfall keyframes,
  reduced-motion guard.
- `apps/web/src/components/theme-toggle.tsx`: add the `christmas` mode, icon,
  label, cycle order and `applyThemeMode` handling.
- `apps/web/src/routes/__root.tsx`: update `THEME_INIT_SCRIPT` to accept
  `christmas`.
- `apps/web/src/components/header.tsx`: festive mark in Christmas mode.
- `apps/web/src/hooks/use-resolved-theme.ts`: no change; it reads the `dark`
  class, so Christmas resolves to `dark` and the toaster is dark.
- `apps/web/src/lib/theme.ts`: `resolveTheme("christmas")` returns `dark`.
- New `apps/web/src/components/snowfall.tsx`, mounted in `__root.tsx`.

## Out of scope

- Automatic December switching.
- A light Christmas variant.
- Decorations on cards, the footer or other pages.
- Festive fonts or new font imports.

## Acceptance checks

- Toggling cycles through all four modes and the label and icon update.
- Reloading in Christmas mode shows no flash of another theme.
- Light, dark and auto look the same as before.
- Snow does not block clicks and is absent with reduced motion on.
- Toasts render with the dark theme in Christmas mode.
- Christmas is festive (green night, candy-cane strip, gold glow) and the
  snow is clearly visible against the background.
- Reloading in Christmas mode never shows a light or paper frame.
- `bun run check` passes.
