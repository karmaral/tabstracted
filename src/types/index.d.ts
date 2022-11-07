import type { IconSource } from '@steeze-ui/svelte-icon/types'
export type IStorage = {
  count: number;
};

export interface MenuOption {
  label: string;
  callback?: (unknown) => unknown;
  callbackParams?: unknown[];
  children?: MenuOption[];
  iconSource?: IconSource
}
export interface ActionOption {
  label: string;
  callback?: (unknown) => unknown;
  iconSource?: IconSource
}

export type WaitingModeEnum = 'waiting' | 'loading' | null;


export interface Tabstracted {
  init(): Promise<void>;
}
