export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Crop the text after `maxLength` characters.
*/
export function ellipsis(text: string, maxChars = 120) {
  return text.length < maxChars
    ? text
    : `${text.substring(0, maxChars)}...`;
}
