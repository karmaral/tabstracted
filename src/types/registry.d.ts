import type { GUID } from '$types/primitives';
import type { Tab } from '$types/models';

export interface RegistryQueryOptions {
  target?: 'tabs' | 'groups' | 'windows' | 'workspaces';
  includeAll?: boolean;
  mapTo?: string;
  [key?: string]: unknown
};
export type RegistryTarget = 'current' | 'previous' | 'deleted';

export interface IRegistry {
  cache: {
    current: {
      tabs: {};
      groups: {};
      windows: {};
      workspaces: {
        [key: GUID]: Workspace
      };
    };
    removed: {
      tabs: {
        [key: GUID]: Tab;
      };
      groups: {};
      windows: {};
      workspaces: {};
    };
    previous: {
      tabs: {
        [key: GUID]: Tab;
      };
      groups: {};
      windows: {};
      workspaces: {
        [key: GUID]: Workspace;
      };
    };
    pending: {
      tabs: Tab[];
      groups: [];
      windows: [];
      workspaces: [];
    };
    clear(): void;
  };
  query(query: RegistryQueryOptions, registry: RegistryType = 'current'): any | any[];
  workspaces: {
    init(): Promise<void>;
    identify(windowId: number): GUID | null;
  };
  windows: {};
  tabs: {
    init(): Promise<void>;
    updateProps(guid: GUID, newProps: { [key: string]: unknown }): Promise<void>;
    syncIndex(guid: GUID): Promise<void>;
    syncAllIndices(options?: { fromIndex: number }): Promise<void>;
    updateFingerprint(updateData: Tab): Promise<void | null>;
    add(addData: Tab): Promise<void | null>;
    /**
     * Moves the tab from the `current` registry into the `removed` one.
     */
    remove(id: number): Promise<void | number>
    /**
     * Writes the currently cached tab registry to the browser storage.
     */
    write(): Promise<void>;
  };
  listeners: {
    tabUpdated(id: number, tab: chrome.tabs.Tab): Promise<void>;
  };
};
