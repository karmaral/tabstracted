import type { IconSource } from '@steeze-ui/svelte-icon/types'

export type IStorage = {
  count: number;
};

export interface ActionOption {
  label: string;
  callback?: (unknown) => unknown;
  iconSource?: IconSource
}
export interface MenuOption extends ActionOption {
  children?: MenuOption[];
}

export type WaitingModeEnum = 'waiting' | 'loading' | null;


export interface Tabstracted {
  init(): Promise<void>;
}
