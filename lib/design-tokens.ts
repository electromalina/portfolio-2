/** Single source of truth for Bauhaus palette values. */
export const colors = {
  cream: "#EEDFBF",
  orange: "#E45815",
  blue: "#7FA1BC",
  yellow: "#F5BE5D",
  ink: "#302E2F",
} as const;

/** the sticker board's colour (MacBook "Midnight"), also used for its eyebrow chip */
export const STICKER_BOARD_COLOR = "#2e3642";

export type AccentName = "orange" | "blue" | "yellow";

export const ACCENT_CYCLE = [colors.orange, colors.blue, colors.yellow] as const;

export const TAG_BG_CYCLE = [
  colors.yellow,
  colors.blue,
  colors.orange,
  colors.cream,
] as const;

/** CSS custom properties from @theme — use in inline styles. */
export const cssVar = {
  cream: "var(--color-cream)",
  orange: "var(--color-orange)",
  blue: "var(--color-blue)",
  yellow: "var(--color-yellow)",
  ink: "var(--color-ink)",
} as const;

/** Accent names in the same order as ACCENT_CYCLE (for class lookups). */
export const ACCENT_NAME_CYCLE: readonly AccentName[] = ["orange", "blue", "yellow"];
