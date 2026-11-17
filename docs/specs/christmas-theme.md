# Christmas theme

Status: draft, not built. Target: about 20 minutes.

## Goal

Add a "Christmas" option to the existing theme toggle. The default look
(terracotta and paper, light and dark) stays exactly as it is. Christmas is
opt-in and easy to remove in January.

## Decisions (from interview)

- **Additive, not a replacement.** Christmas is a third theme mode.
- **Light decoration, not colours only.** Palette, a festive header mark and a
  light snowfall animation. No decoration on cards or the footer.
- **One fixed palette.** Christmas does not follow the system light/dark
  preference. It is a single light, festive look.

## Behaviour

1. The theme toggle cycles `auto -> light -> dark -> christmas -> auto`.
   Label "Christmas", with a snowflake or tree icon from `lucide-react`.
2. Choosing Christmas is saved in `localStorage` under the existing `theme`
   key (new value `christmas`) and restored on reload without a flash. The
   inline `THEME_INIT_SCRIPT` in `routes/__root.tsx` must accept it.
3. In Christmas mode:
   - `<html>` gets class `christmas` (not `light` or `dark`),
     `data-theme="christmas"` and `color-scheme: light`.
   - The palette comes from a new `.christmas` block in `styles.css` that
     overrides the same CSS variables the light and dark blocks set
     (`--background`, `--primary`, `--card`, `--border`, `--ring`,
     `--chart-*`, `--sidebar-*`, `--brand-label`, etc.).
   - Colours: snow-white background, deep holly green for text and surfaces,
     Christmas red as the accent (replacing terracotta). Primary-on-text and
     body text must still pass WCAG AA contrast.
   - The header dot next to "Teamdesk" becomes a small festive mark (a tree
     emoji or icon) shown only in Christmas mode.
   - A light snowfall animation sits behind the page content.
4. Snowfall:
   - Pure CSS or a small React component, no new dependency.
   - A fixed, full-viewport layer with `pointer-events: none` and a low
     `z-index`, so it never blocks clicks or covers text.
   - A modest number of flakes (around 30) so it stays cheap.
   - Disabled entirely under `prefers-reduced-motion: reduce`.
   - Rendered only while Christmas mode is active.
5. Other modes are unchanged. The `dark` custom variant
   (`&:is(.dark *)`) must not apply in Christmas mode.

## Files likely touched

- `apps/web/src/styles.css`: `.christmas` palette block, snowfall keyframes,
  reduced-motion guard.
- `apps/web/src/components/theme-toggle.tsx`: add the `christmas` mode, icon,
  label, cycle order and `applyThemeMode` handling.
- `apps/web/src/routes/__root.tsx`: update `THEME_INIT_SCRIPT` to accept
  `christmas`.
- `apps/web/src/components/header.tsx`: festive mark in Christmas mode.
- `apps/web/src/hooks/use-resolved-theme.ts`: resolve Christmas to `light`
  for the toaster. Check how it reads the theme.
- New `apps/web/src/components/snowfall.tsx`, mounted in `__root.tsx`.

## Out of scope

- Automatic December switching.
- A dark Christmas variant.
- Decorations on cards, the footer or other pages.
- Festive fonts or new font imports.

## Acceptance checks

- Toggling cycles through all four modes and the label and icon update.
- Reloading in Christmas mode shows no flash of another theme.
- Light, dark and auto look the same as before.
- Snow does not block clicks and is absent with reduced motion on.
- Toasts render with the light theme in Christmas mode.
- `bun run check` passes.
