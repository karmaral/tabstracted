import type { Fingerprint } from '$types/primitives';

// from https://stackoverflow.com/a/33647870/12271438
function stringToHash(str: string): Fingerprint {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function isIterable(obj: any): boolean {
  if (obj == null) return false;
  return typeof obj[Symbol.iterator] === 'function';
}
function isEmpty(obj: any): boolean {
  for (const x in obj) return false;
  return true;
}

function GUID(): string {
  return crypto.randomUUID();
}


async function createHubTab(): Promise<chrome.tabs.Tab> {
  const url = chrome.runtime.getURL('src/main/index.html');
  const tab = await chrome.tabs.create({ url });
  return tab;
}

export {
  stringToHash,
  isIterable,
  isEmpty,
  GUID,
  createHubTab,
}
