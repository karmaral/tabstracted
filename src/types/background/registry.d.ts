import type { GUID } from '$types/background/primitives';
import type { Tab, Window, Workspace } from '$types/models';

export interface RegistryQueryOptions {
  target?: 'tabs' | 'groups' | 'windows' | 'workspaces';
  includeAll?: boolean;
  mapTo?: string;
  [key?: string]: unknown
}

export type RegistryType = 'current' | 'previous' | 'deleted';

interface RegistryBlock {
  tabs: {
    [key: GUID]: Tab;
  };
  groups: {};
  windows: {
    [key: GUID]: Window;
  };
  workspaces: {
    [key: GUID]: Workspace;
  };
};
interface PreviousRegistryBlock extends RegistryBlock {
  tabs: RegistryBlock['tabs'] | null;
  groups: RegistryBlock['groups'] | null;
  windows: RegistryBlock['windows'] | null;
  workspaces: RegistryBlock['workspaces'] | null;
};

interface PendingRegistryBlock extends RegistryBlock {
  tabs: Tab[];
  groups: Group[];
  windows: Window[];
  workspaces: Workspace[];
};

export interface RegistryModule {
  cache: {
    current: RegistryBlock;
    removed: RegistryBlock;
    previous: PreviousRegistryBlock;
    pending: PendingRegistryBlock;
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
    remove(id: number | number[]): Promise<void | number>
    /**
     * Writes the currently cached tab registry to the browser storage.
     */
    writeToStorage(): Promise<void>;
  };
  listeners: {
    tabUpdated(id: number, tab: chrome.tabs.Tab): Promise<void>;
  };
}
