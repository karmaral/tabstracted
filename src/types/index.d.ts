import type { IconSource } from '@steeze-ui/svelte-icon/types'
import type { Readable } from 'svelte/store';

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


export interface IdListStore<T> extends Readable<T[]> {
  add(data: T | T[]): void;
  remove(data: T | T[]): void;
  toggle(data: T | T[]): void;
  clear(): void;
}
