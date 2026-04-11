import { ACTIVATION_DISTANCE_THRESHOLD } from "$features/ui/sortable";

/**
 * Crop the text after `maxLength` characters.
*/
export function ellipsis(text: string, maxChars = 120) {
  return text.length < maxChars
    ? text
    : `${text.substring(0, maxChars)}...`;
}

/* 
* Action for handling sortable input that doesn't turn into a sorting operation 
*/
export function clickOnStatic(node: HTMLElement, callback: (ev: MouseEvent) => void) {
  let startX = 0;
  let startY = 0;

  function onDown(ev: PointerEvent) {
    startX = ev.clientX;
    startY = ev.clientY;
  }

  function onUp(ev: PointerEvent) {
    const deltaX = ev.clientX - startX;
    const deltaY = ev.clientY - startY;

    if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) < ACTIVATION_DISTANCE_THRESHOLD) {
      callback(ev);
    }
  }

  node.addEventListener('pointerdown', onDown, true);
  node.addEventListener('pointerup', onUp, true);

  return {
    destroy() {
      node.removeEventListener('pointerdown', onDown, true);
      node.removeEventListener('pointerup', onUp, true);
    }
  }

}