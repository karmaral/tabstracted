import type { IconSource } from '@steeze-ui/svelte-icon/types'
import type { Readable } from 'svelte/store';

export type IStorage = {
  count: number;
};

export interface ActionOption {
  id: string;
  label: string;
  callback?: (unknown?) => unknown;
  iconSource?: IconSource
}

type MenuOptionType = 'entry' | 'separator';

export interface MenuOption extends ActionOption {
  type: MenuOptionType;
  id?: { type: 'entry' } extends { type: MenuOptionType } ? string : never;
  label?: { type: 'entry' } extends { type: MenuOptionType } ? string : never;
  callback?: { type: 'entry' } extends { type: MenuOptionType } ? (unknown?) => unknown : never;
  children?: { type: 'entry' } extends { type: MenuOptionType } ? MenuOption[] : never;
  children_source?: 'group' | 'window' | 'workspace';
  iconSource?: { type: 'entry' } extends { type: MenuOptionType } ? IconSource : never;
  disabled?: boolean;
}

export interface MenuState {
  owner: HTMLElement;
  lastOwner: { elem: HTMLElement, closeAction : () => void };
  open: boolean;
  closeAction: () => void;
  entries: MenuOption[];
  ref: HTMLDivElement | null;
}

export type WaitingModeEnum = 'waiting' | 'loading' | null;

export type ContentView = 'tab';


export interface Tabstracted {
  init(): Promise<void>;
}


export interface IdListStore<T> extends Readable<T[]> {
  add(data: T | T[]): void;
  remove(data: T | T[]): void;
  toggle(data: T | T[]): void;
  clear(): void;
}
