import type { Fingerprint } from '$types/background/primitives';

export async function createHubTab(): Promise<Browser.tabs.Tab> {
  const url = browser.runtime.getURL('/tabstracted.html');
  const tab = await browser.tabs.create({ url });
  return tab;
}

// from https://stackoverflow.com/a/33647870/12271438
export function stringToHash(str: string): Fingerprint {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function isIterable(obj: any): boolean {
  if (obj == null) return false;
  return typeof obj[Symbol.iterator] === 'function';
}

export function isEmpty(obj: any): boolean {
  for (const x in obj) return false;
  return true;
}

export function GUID(): string {
  return crypto.randomUUID();
}


export function asArray(items: unknown) {
  return Array.isArray(items) ? items : [items];
}

export function isKeyOf<T extends Object>(key: PropertyKey, obj: T): key is keyof T {
  return key in obj;
}