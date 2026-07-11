import type { GroupRenderData, TabRenderData } from '$types/render';
import { clamp } from '$lib/utils';

export type DisplayItem = TabRenderData | GroupRenderData;

export function isGroupItem(item: DisplayItem): item is GroupRenderData {
  return 'index_span' in item;
}

/** Number of browser-tab slots a display item occupies (1 for a tab, N for a group). */
export function itemSize(item: DisplayItem): number {
  return isGroupItem(item) ? item.tab_ids.length : 1;
}

/** Lowest browser-tab index a display item occupies. */
export function itemStartIndex(item: DisplayItem): number {
  return isGroupItem(item) ? item.index_span[0] : item.index;
}

/**
 * Compute the browser-tab `index` to hand to `browser.tabs.move` when a
 * top-level display item is dropped at `destIndex` in the display list.
 *
 * `root` is the top-level display list (groups + ungrouped tabs) sorted by
 * browser index, with no gaps between visible tabs. `movedId` is the dragged
 * item's id and `destIndex` is its destination position within `root` (dnd-kit's
 * optimistic `source.sortable.index`).
 *
 * `tabs.move({ index })` interprets `index` as the position in the strip *after*
 * the moved tab(s) are removed and the remaining tabs collapse. So the target is
 * simply the number of tab-slots that precede the drop position among the other
 * items, offset by the strip's baseline (the first visible browser index, which
 * is non-zero when pinned tabs are hidden from the list).
 */
export function computeReorderIndex(
  root: DisplayItem[],
  movedId: number,
  destIndex: number,
): number {
  const rest = root.filter((it) => it.id !== movedId);
  if (rest.length === 0) return 0;

  const baseline = itemStartIndex(root[0]);

  const stop = clamp(destIndex, 0, rest.length);
  let precedingSlots = 0;
  for (let i = 0; i < stop; i++) {
    precedingSlots += itemSize(rest[i]);
  }
  return baseline + precedingSlots;
}
