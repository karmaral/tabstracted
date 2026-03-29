import { ClassValue } from "clsx";

export interface ExtensionActionMessage {
  action: string;
  payload: Record<string, any | any[]>;
}

export interface ActionOption {
  id: string;
  label: string;
  callback?: (args?: any | any[]) => unknown;
  iconSource?: IconSource;
  iconOnly?: boolean;
  class?: ClassValue;
};

export type MenuOptionType = 'entry' | 'separator';

export interface MenuOption extends ActionOption {
  type: MenuOptionType;
  id?: { type: 'entry' } extends { type: MenuOptionType } ? string : never;
  label?: { type: 'entry' } extends { type: MenuOptionType } ? string : never;
  callback?: { type: 'entry' } extends { type: MenuOptionType } ? (args?: any[]) => unknown : never;
  children?: { type: 'entry' } extends { type: MenuOptionType } ? MenuOption[] : never;
  children_source?: 'group' | 'window' | 'workspace';
  iconSource?: { type: 'entry' } extends { type: MenuOptionType } ? IconSource : never;
  disabled?: boolean;
};

export interface ProgramState {
  settingsOpen: boolean;
}

export interface MenuState {
  owner: HTMLElement;
  lastOwner: { elem: HTMLElement, closeAction: () => void };
  open: boolean;
  closeAction: () => void;
  entries: MenuOption[];
  element: HTMLDivElement | null;
}

export type WaitingModeEnum = 'waiting' | 'loading' | null;

export type ContentView = 'tab';
