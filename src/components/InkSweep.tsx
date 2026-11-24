/**
 * The site's hover effect: an ink fill sweeping in from the left (scaleX is
 * GPU-composited, so no repaint). Put it as the first child of a
 * `group relative overflow-hidden` element, then wrap the content after it
 * in an element with `relative` (to sit on top) and `INK_SWEEP_TEXT`.
 * Note: Tailwind's `group-hover:` only styles descendants of `.group`, never
 * the group itself, so the text colour must go on that inner wrapper.
 */
export const INK_SWEEP_TEXT =
  "transition-colors duration-300 group-hover:text-cream group-focus-visible:text-cream";

export default function InkSweep() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
    />
  );
}
