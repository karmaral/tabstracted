import type { PendingRegistryBlock, PreviousRegistryBlock, RegistryBlock, RegistryModule } from '$types/background/registry';
import type { Window, Tab, TabAttributes, Workspace, Group } from '$types/models';
import type { Fingerprint, GUID as tGUID } from '$types/background/primitives';
import { GUID, isIterable, stringToHash, isEmpty } from '$libB/utils';

interface TabRegistryQueryParams {
  id?: number;
  index?: number;
  fingerprint?: Fingerprint;
}

export class CurrentRegistry {
  static workspaces = {} as { [key: tGUID]: Workspace };
  static windows = {} as { [key: tGUID]: Window };
  static groups = {} as { [key: tGUID]: Group };
  static tabs = {} as { [key: tGUID]: Tab };

  static getWorkspace(guid: tGUID): Workspace | null; 
  static getWorkspace(guid: tGUID[]): Workspace[] | null;
  static getWorkspace<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Workspace[] = [];
      guid.forEach(g => {
        if (!CurrentRegistry.workspaces.hasOwnProperty(g)) return;
        result.push(CurrentRegistry.workspaces[g]);
      });
      return result.length ? result : null;
    }

    if (!CurrentRegistry.workspaces.hasOwnProperty(guid)) {
      return null;
    }

    return CurrentRegistry.workspaces[guid as tGUID];
  }

  static getWindow(guid: tGUID): Window | null; 
  static getWindow(guid: tGUID[]): Window[] | null;
  static getWindow<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Window[] = [];
      guid.forEach(g => {
        if (!CurrentRegistry.windows.hasOwnProperty(g)) return;
        result.push(CurrentRegistry.windows[g]);
      });
      return result.length ? result : null;
    }

    if (!CurrentRegistry.windows.hasOwnProperty(guid)) {
      return null;
    }

    return CurrentRegistry.windows[guid as tGUID];
  }

  static getGroup(guid: tGUID): Group | null; 
  static getGroup(guid: tGUID[]): Group[] | null;
  static getGroup<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Group[] = [];
      guid.forEach(g => {
        if (!CurrentRegistry.groups.hasOwnProperty(g)) return;
        result.push(CurrentRegistry.groups[g]);
      });
      return result.length ? result : null;
    }

    if (!CurrentRegistry.groups.hasOwnProperty(guid)) {
      return null;
    }

    return CurrentRegistry.groups[guid as tGUID];
  }

  static getTab(guid: tGUID): Tab | null; 
  static getTab(guid: tGUID[]): Tab[] | null;
  static getTab<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Tab[] = [];
      guid.forEach(g => {
        if (!CurrentRegistry.tabs.hasOwnProperty(g)) return;
        result.push(CurrentRegistry.tabs[g]);
      });
      return result.length ? result : null;
    }

    if (!CurrentRegistry.tabs.hasOwnProperty(guid)) {
      return null;
    }

    return CurrentRegistry.tabs[guid as tGUID];
  }
}

export class RemovedRegistry {
  static workspaces = {} as { [key: tGUID]: Workspace };
  static windows = {} as { [key: tGUID]: Window };
  static groups = {} as { [key: tGUID]: Group };
  static tabs = {} as { [key: tGUID]: Tab };

  static getWorkspace(guid: tGUID): Workspace | null; 
  static getWorkspace(guid: tGUID[]): Workspace[] | null;
  static getWorkspace<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Workspace[] = [];
      guid.forEach(g => {
        if (!RemovedRegistry.workspaces.hasOwnProperty(g)) return;
        result.push(RemovedRegistry.workspaces[g]);
      });
      return result.length ? result : null;
    }

    if (!RemovedRegistry.workspaces.hasOwnProperty(guid)) {
      return null;
    }

    return RemovedRegistry.workspaces[guid as tGUID];
  }

  static getWindow(guid: tGUID): Window | null; 
  static getWindow(guid: tGUID[]): Window[] | null;
  static getWindow<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Window[] = [];
      guid.forEach(g => {
        if (!RemovedRegistry.windows.hasOwnProperty(g)) return;
        result.push(RemovedRegistry.windows[g]);
      });
      return result.length ? result : null;
    }

    if (!RemovedRegistry.windows.hasOwnProperty(guid)) {
      return null;
    }

    return RemovedRegistry.windows[guid as tGUID];
  }

  static getGroup(guid: tGUID): Group | null; 
  static getGroup(guid: tGUID[]): Group[] | null;
  static getGroup<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Group[] = [];
      guid.forEach(g => {
        if (!RemovedRegistry.groups.hasOwnProperty(g)) return;
        result.push(RemovedRegistry.groups[g]);
      });
      return result.length ? result : null;
    }

    if (!RemovedRegistry.groups.hasOwnProperty(guid)) {
      return null;
    }

    return RemovedRegistry.groups[guid as tGUID];
  }

  static getTab(guid: tGUID): Tab | null; 
  static getTab(guid: tGUID[]): Tab[] | null;
  static getTab<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Tab[] = [];
      guid.forEach(g => {
        if (!PreviousRegistry.tabs.hasOwnProperty(g)) return;
        result.push(PreviousRegistry.tabs[g]);
      });
      return result.length ? result : null;
    }

    if (!PreviousRegistry.tabs.hasOwnProperty(guid)) {
      return null;
    }

    return PreviousRegistry.tabs[guid as tGUID];
  }
}

export class PreviousRegistry {
  static workspaces = {} as { [key: tGUID]: Workspace };
  static windows = {} as { [key: tGUID]: Window };
  static groups = {} as { [key: tGUID]: Group };
  static tabs = {} as { [key: tGUID]: Tab };

  static getWorkspace(guid: tGUID): Workspace | null; 
  static getWorkspace(guid: tGUID[]): Workspace[] | null;
  static getWorkspace<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Workspace[] = [];
      guid.forEach(g => {
        if (!PreviousRegistry.workspaces.hasOwnProperty(g)) return;
        result.push(PreviousRegistry.workspaces[g]);
      });
      return result.length ? result : null;
    }

    if (!PreviousRegistry.workspaces.hasOwnProperty(guid)) {
      return null;
    }

    return PreviousRegistry.workspaces[guid as tGUID];
  }

  static getWindow(guid: tGUID): Window | null; 
  static getWindow(guid: tGUID[]): Window[] | null;
  static getWindow<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Window[] = [];
      guid.forEach(g => {
        if (!PreviousRegistry.windows.hasOwnProperty(g)) return;
        result.push(PreviousRegistry.windows[g]);
      });
      return result.length ? result : null;
    }

    if (!PreviousRegistry.windows.hasOwnProperty(guid)) {
      return null;
    }

    return PreviousRegistry.windows[guid as tGUID];
  }

  static getGroup(guid: tGUID): Group | null; 
  static getGroup(guid: tGUID[]): Group[] | null;
  static getGroup<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Group[] = [];
      guid.forEach(g => {
        if (!PreviousRegistry.groups.hasOwnProperty(g)) return;
        result.push(PreviousRegistry.groups[g]);
      });
      return result.length ? result : null;
    }

    if (!PreviousRegistry.groups.hasOwnProperty(guid)) {
      return null;
    }

    return PreviousRegistry.groups[guid as tGUID];
  }

  static getTab(guid: tGUID): Tab | null; 
  static getTab(guid: tGUID[]): Tab[] | null;
  static getTab<T extends tGUID | tGUID[]>(guid: T) {
    if (Array.isArray(guid)) {
      const result: Tab[] = [];
      guid.forEach(g => {
        if (!PreviousRegistry.tabs.hasOwnProperty(g)) return;
        result.push(PreviousRegistry.tabs[g]);
      });
      return result.length ? result : null;
    }

    if (!PreviousRegistry.tabs.hasOwnProperty(guid)) {
      return null;
    }

    return PreviousRegistry.tabs[guid as tGUID];
  }
}

export class PendingRegistry {
  static workspaces = [] as Workspace[];
  static windows = [] as Window[];
  static groups = [] as Group[];
  static tabs = [] as Tab[];

  constructor() {}
}

export class WorkspaceRegistry {

  constructor() { }

  async init() {
    const storage = await browser.storage.local.get('registry_workspaces');
    PreviousRegistry.workspaces = storage.registry_workspaces || {};
  
    // ...
  }

  /** Identify the workspace based on the window's ID */
  static identify(windowId: number): tGUID | null {
    const windowsMatch = WindowRegistry.query(windowId);

    if (windowsMatch) {
      const w = windowsMatch[0];
      if (!w.workspace_guid) return null;

      return w.workspace_guid;
    }

    return null;
  }

  static get(guid: tGUID, type: 'current' | 'removed' | 'previous'): Workspace | null;
  static get(guid: tGUID[], type: 'current' | 'removed' | 'previous'): Workspace[] | null;
  static get<T extends tGUID | tGUID[]>(guid: T, type: 'current' | 'removed' | 'previous') {
    const multiple = Array.isArray(guid);
    let resultSingle: Workspace | null = null;
    const results: Workspace[] = [];
    switch (type) {
      case 'current':
        if (multiple) {
          guid.forEach(g => {
            if (!CurrentRegistry.workspaces.hasOwnProperty(g)) return;
            const workspace = CurrentRegistry.workspaces[g];
            results.push(workspace);
          });
          return results;
        }
        resultSingle = CurrentRegistry.workspaces.hasOwnProperty(guid) ? CurrentRegistry.workspaces[guid as tGUID] : null;
        return resultSingle;
      case 'removed':
        if (multiple) {
          guid.forEach(g => {
            if (!RemovedRegistry.workspaces.hasOwnProperty(g)) return;
            const workspace = RemovedRegistry.workspaces[g];
            results.push(workspace);
          });
          return results;
        }
        resultSingle = RemovedRegistry.workspaces.hasOwnProperty(guid) ? RemovedRegistry.workspaces[guid as tGUID] : null;
        return resultSingle;
      case 'previous':
        if (multiple) {
          guid.forEach(g => {
            if (!PreviousRegistry.workspaces.hasOwnProperty(g)) return;
            const workspace = PreviousRegistry.workspaces[g]
            results.push(workspace);
          });
          return results;
        }
        resultSingle = PreviousRegistry.workspaces.hasOwnProperty(guid) ? PreviousRegistry.workspaces[guid as tGUID] : null;
        return resultSingle;
      default: break;
    }

    return null;
  }

  static clear() {
    CurrentRegistry.workspaces = {};
    RemovedRegistry.workspaces = {};
    PreviousRegistry.workspaces = {};
    PendingRegistry.workspaces = [];
  }
}

export class WindowRegistry {
  static current = {} as { [key: tGUID]: Window };
  static removed = {} as { [key: tGUID]: Window };
  static previous = {} as { [key: tGUID]: Window } | null;
  static pending = [] as Window[];

  constructor() { }

  static query(id: number): Window[] | null {
    const result: Window[] = [];
    Object.entries(WindowRegistry.current).forEach(entry => {
      const [_guid, w] = entry;
      if (w.id === id) {
        result.push(w);
      }
    });

    return result.length ? result : null;
  }

  static clear() {
    WindowRegistry.current = {};
    WindowRegistry.previous = {};
    WindowRegistry.removed = {};
    WindowRegistry.pending = [];
  }
}

export class TabRegistry {

  constructor() {}

  static async init() {
    const storage = await browser.storage.local.get('registry_tabs');
    PreviousRegistry.tabs = storage.registry_tabs || {};

    PendingRegistry.tabs.forEach(tab => {
      const updateData: Tab = {
        id: tab.id,
        index: tab.index,
        fingerprint: tab.fingerprint,
        attributes: tab.attributes,
        window_id: tab.window_id,
        window_guid: tab.window_guid,
        group_guid: tab.group_guid,
      };
      TabRegistry.updateFingerprint(updateData);
    });

    const allTabs = await browser.tabs.query({});
    allTabs.forEach(tab => TabRegistry.onTabUpdated(tab.id!, tab));
  }

  static get(guid: tGUID, type: 'current' | 'removed' | 'previous'): Tab | null;
  static get(guid: tGUID[], type: 'current' | 'removed' | 'previous'): Tab[] | null;
  static get<T extends tGUID | tGUID[]>(guid: T, type: 'current' | 'removed' | 'previous') {
    const multiple = Array.isArray(guid);
    let resultSingle: Tab | null = null;
    const results: Tab[] = [];
    switch (type) {
      case 'current':
        if (multiple) {
          guid.forEach(g => {
            if (!CurrentRegistry.tabs.hasOwnProperty(g)) return;
            const tab = CurrentRegistry.tabs[g];
            results.push(tab);
          });
          return results;
        }
        resultSingle = CurrentRegistry.tabs.hasOwnProperty(guid) ? CurrentRegistry.tabs[guid as tGUID] : null;
        return resultSingle;
      case 'removed':
        if (multiple) {
          guid.forEach(g => {
            if (!RemovedRegistry.tabs.hasOwnProperty(g)) return;
            const tab = RemovedRegistry.tabs[g];
            results.push(tab);
          });
          return results;
        }
        resultSingle = RemovedRegistry.tabs.hasOwnProperty(guid) ? RemovedRegistry.tabs[guid as tGUID] : null;
        return resultSingle;
      case 'previous':
        if (multiple) {
          guid.forEach(g => {
            if (!PreviousRegistry.tabs.hasOwnProperty(g)) return;
            const tab = PreviousRegistry.tabs[g]
            results.push(tab);
          });
          return results;
        }
        resultSingle = PreviousRegistry.tabs.hasOwnProperty(guid) ? PreviousRegistry.tabs[guid as tGUID] : null;
        return resultSingle;
      default: break;
    }

    return null;
  }

  /** Queries the main (current) registry */
  static query(queryParams: TabRegistryQueryParams = {}): tGUID[] | null {
    const result: tGUID[] = [];
    const { id, fingerprint, index } = queryParams;

    Object.entries(CurrentRegistry.tabs).forEach(entry => {
      const [guid, tab] = entry;

      // Ignore other queryParams if id is specified
      if (id) {
        if (tab.id === id) {
          result.push(guid);
          return;
        }
      }
      const { index, fingerprint } = queryParams;
      if (index && index !== tab.index) return;
      if (fingerprint && fingerprint !== tab.fingerprint) return;
      result.push(guid);
    });

    return result.length ? result : null;
  }
  static queryRemoved(queryParams: TabRegistryQueryParams = {}): tGUID[] | null {
    const result: tGUID[] = [];
    const { id, fingerprint, index } = queryParams;

    Object.entries(RemovedRegistry.tabs).forEach(entry => {
      const [guid, tab] = entry;

      // Ignore queryParams if id is specified
      if (id) {
        if (tab.id === id) {
          result.push(guid);
          return;
        }
      }
      const { index, fingerprint } = queryParams;
      if (index && index !== tab.index) return;
      if (fingerprint && fingerprint !== tab.fingerprint) return;
      result.push(guid);
    });

    return result.length ? result : null;
  }
  static queryPrevious(queryParams: TabRegistryQueryParams = {}): tGUID[] | null {
    const result: tGUID[] = [];
    const { id, fingerprint, index } = queryParams;

    Object.entries(PreviousRegistry.tabs).forEach(entry => {
      const [guid, tab] = entry;

      // Ignore queryParams if id is specified
      if (id) {
        if (tab.id === id) {
          result.push(guid);
          return;
        }
      }
      const { index, fingerprint } = queryParams;
      if (index && index !== tab.index) return;
      if (fingerprint && fingerprint !== tab.fingerprint) return;
      result.push(guid);
    });

    return result.length ? result : null;
  }
  static queryPending(queryParams: TabRegistryQueryParams): Tab[] | null {
    const result: Tab[] = [];
    const { id, fingerprint, index } = queryParams;

    if (!PendingRegistry.tabs.length) return null;

   PendingRegistry.tabs.forEach(tab => {

      // Ignore queryParams if id is specified
      if (id) {
        if (tab.id === id) {
          result.push(tab);
          return;
        }
      }
      const { index, fingerprint } = queryParams;
      if (index && index !== tab.index) return;
      if (fingerprint && fingerprint !== tab.fingerprint) return;
      result.push(tab);
    });

    return result.length ? result : null;
  }

  static clear() {
    CurrentRegistry.tabs = {};
    RemovedRegistry.tabs = {};
    PreviousRegistry.tabs = {};
    PendingRegistry.tabs = [];
  }

  static async syncIndex(guid: tGUID) {
    const regTab = CurrentRegistry.tabs[guid];
    if (!regTab) return;
    
    const tab = await browser.tabs.get(regTab.id);
    regTab.index = tab.index;
    await TabRegistry.writeToStorage();
  }

  static async writeToStorage() {
      await browser.storage.local.set({ registry_tabs: CurrentRegistry.tabs });
  }

  static async syncAllIndices(options = { fromIndex: 0 }) {
    for (const guid in CurrentRegistry.tabs) {
      if (options.fromIndex > CurrentRegistry.tabs[guid].index) continue;
      await TabRegistry.syncIndex(guid);
    }
  }

  static async updateFingerprint(updateData: Tab) {
    const { id, index, fingerprint, attributes } = updateData;

    if (!id || !(index > -1) || !fingerprint) return null;

    const guid = TabRegistry.query({ id })?.[0];

    // Found match
    if (guid) {
      const tab = TabRegistry.get(guid[0], 'current')!;
      tab.fingerprint = fingerprint;

      // TODO: this might not be the -best- place to update the attrs, but it is handy
      if (attributes) {
        Object.assign(CurrentRegistry.tabs[guid].attributes, attributes);
      }
      await TabRegistry.writeToStorage();
      return;
    }

    // Registry did not initialize yet
    if (!Object.keys(PreviousRegistry.tabs).length) {
      const pending = { id, index, fingerprint, attributes };
      PendingRegistry.tabs.push(pending);
      return;
    }

    // const addData: Tab = { id, index, fingerprint, attributes };
    // if (updateData.window_id) {
    //   addData.window_id = updateData.window_id;
    // }
  }

  static async add(addData: Tab) {
    const { id, index, fingerprint, attributes } = addData;

    if (!id || !(index > -1) || !fingerprint) return null;

    // Restore the tab if it was previously closed
    const prevGuid = TabRegistry.queryPrevious({ index, fingerprint });
    const removedGuid = TabRegistry.queryRemoved({ index, fingerprint });

    [prevGuid, removedGuid].forEach(g => {
      const guid = g![0];
      if (!guid) return;
      let targetRegistry: 'previous' | 'removed' = guid === prevGuid?.[0] ? 'previous' : 'removed';
      const tab = TabRegistry.get(guid, targetRegistry);
      const tabAttributes = tab?.attributes || {};
      CurrentRegistry.tabs[guid] = { id, index, fingerprint, attributes: tabAttributes };
      if (targetRegistry === 'previous') {
        delete PreviousRegistry.tabs[guid];
      } else {
        delete RemovedRegistry.tabs[guid];
      }

      TabRegistry.writeToStorage();
      return;
    });


    const newGuid = GUID();
    const newTab: Tab = { id, index, fingerprint, attributes };
    if (addData.window_id) {
      newTab.window_id = addData.window_id;
    }
    TabRegistry.current[newGuid] = newTab;

    await TabRegistry.writeToStorage();
    await TabRegistry.syncAllIndices({ fromIndex: index });
    return;
  }

  static async remove(id: number | number[]): Promise<number | void> {
    if (isIterable(id)) {
      for (const i of id as number[]) {
        await TabRegistry.remove(i);
      }
      return;
    }

    const guid = registry.query({ id });
    if (!guid) return;

    RemovedRegistry.tabs[guid] = CurrentRegistry.tabs[guid];
    delete CurrentRegistry.tabs[guid];
    await TabRegistry.writeToStorage();

    const removedIndex = RemovedRegistry.tabs[guid].index;
    return removedIndex;
  }
  
  static async onTabUpdated(id: number, tab: Browser.tabs.Tab) {
    if (tab.url && tab.url.startsWith('chrome-extension://')) {
      if (tab.url.includes(browser.runtime.id)) {
        const fingerprint = stringToHash(`${tab.url},${tab.index}`);

        const attributeData: TabAttributes = {
          title: tab.title,
          url: tab.url,
          favicon_url: tab.favIconUrl,
          pinned: tab.pinned,
        };
        const updateData: Tab = {
          id,
          index: tab.index,
          fingerprint,
          window_id: tab.windowId,
          attributes: attributeData,
        };

        TabRegistry.updateFingerprint(updateData);
      }
      return;
    }

    // Attempt to generate fingerprint
    browser.scripting.executeScript({
      target: { tabId: id },
      func: () => {
        return JSON.stringify([location.href, document.referrer, history.length]);
      },
    },
      (resultData) => {
        let fingerprint: Fingerprint;

        if (resultData !== undefined) {
          fingerprint = stringToHash(resultData[0].result as string);
        } else {
          fingerprint = stringToHash(tab.url as string);
        }

        const attributeData: TabAttributes = {
          title: tab.title,
          url: tab.url,
          favicon_url: tab.favIconUrl,
          pinned: tab.pinned,
        };
        const updateData: Tab = {
          id,
          index: tab.index,
          fingerprint,
          window_id: tab.windowId,
          attributes: attributeData,
        };

        TabRegistry.updateFingerprint(updateData);
      }
    );
  }

}

const registry: RegistryModule = {
  cache: {
    current: {
      workspaces: {},
      windows: {},
      groups: {},
      tabs: {},
    },
    removed: {
      workspaces: {},
      windows: {},
      groups: {},
      tabs: {},
    },
    previous: {
      workspaces: null,
      windows: null,
      groups: null,
      tabs: null,
    },
    pending: {
      workspaces: [],
      windows: [],
      groups: [],
      tabs: [],
    },
    clear() {
      const registryTypes = Object.keys(registry.cache);
      registryTypes.forEach(r => {
        const type = r as keyof Omit<RegistryModule['cache'], 'clear'>;
        const block: RegistryBlock | PreviousRegistryBlock | PendingRegistryBlock  = registry.cache[type];
        const targets = Object.keys(block);
        targets.forEach(t => {
          const target = t as keyof RegistryBlock;
          const val = type === 'pending' ? [] : {};
          registry.cache[type][target] = val;
        });
      });
      // registry.cache.current.windows = {};
      // registry.cache.removed.windows = {};
      // registry.cache.pending.windows = [];
      // registry.cache.current.tabs = {};
      // registry.cache.removed.tabs = {};
      // registry.cache.pending.tabs = [];
    }
  },
  query(query, registryType = 'current') {
    let { target, includeAll, mapTo, ...queryParams } = query;
    const type = registryType as keyof Omit<RegistryModule['cache'], 'clear' | 'pending'>;
    target = target ?? 'tabs';
    includeAll = includeAll ?? false;
    const registry = this.cache[type][target];
    if (!registry) return false;

    const targets = Object.keys(registry);
    const result = targets.filter(guid => {
      for (const param in queryParams) {
        if (registry[guid][param] !== queryParams[param]) {
          return false;
        }
      }
      return true;
    });

    if (mapTo) {
      const mappedResult = result.map(guid => registry[guid][mapTo]);
      return mappedResult;
    }

    if (result.length > 1 && includeAll) {
      return result;
    }

    return result.length ? result[0] : null;
  },
  tabs: {
    async init() {
      const storage = await browser.storage.local.get('registry_tabs');
      registry.cache.previous.tabs = storage.registry_tabs || {};

      registry.cache.pending.tabs.forEach(tab => {
        const updateData: Tab = {
          id: tab.id,
          index: tab.index,
          fingerprint: tab.fingerprint,
          attributes: tab.attributes,
          window_id: tab.window_id,
          window_guid: tab.window_guid,
          group_guid: tab.group_guid,
        };
        registry.tabs.updateFingerprint(updateData);
      });

      const allTabs = await browser.tabs.query({});
      allTabs.forEach(tab => registry.listeners.tabUpdated(tab.id, tab));
    },
    async syncIndex(guid) {
      const id = registry.cache.current.tabs[guid].id;
      const tab = await browser.tabs.get(id);
      registry.cache.current.tabs[guid].index = tab.index;
      await registry.tabs.writeToStorage();
    },
    // TODO: This function might be too general / redundant
    async updateProps(guid, newProps = {}) {
      // TODO: replace w/ lodash
      if (isEmpty(newProps)) return;

      for (const key in newProps) {
        const updatedValue = newProps[key];
        if (!updatedValue) continue;

        registry.cache.current.tabs[guid][key] = updatedValue;
      }

      await registry.tabs.writeToStorage();
    },
    async syncAllIndices(options = { fromIndex: 0 }) {
      const targetRegistry = this.cache?.current.tabs;
      for (const guid in targetRegistry) {
        if (options.fromIndex > targetRegistry[guid].index) continue;
        await registry.tabs.syncIndex(guid);
      }
    },
    async updateFingerprint(updateData) {
      const { id, index, fingerprint, attributes } = updateData;

      if (!id || !(index > -1) || !fingerprint) return null;

      const guid = registry.query({ id });

      // Found match
      if (guid) {
        registry.cache.current.tabs[guid].fingerprint = fingerprint;

        // TODO: this might not be the -best- place to update the attrs, but it is handy
        if (attributes) {
          Object.assign(registry.cache.current.tabs[guid].attributes, attributes);
        }
        await registry.tabs.writeToStorage();
        return;
      }

      // Registry did not initialize yet
      if (registry.cache.previous.tabs === null) {
        const pending = { id, index, fingerprint, attributes };
        registry.cache.pending.tabs.push(pending);
        return;
      }

      const addData: Tab = { id, index, fingerprint, attributes };
      if (updateData.window_id) {
        addData.window_id = updateData.window_id;
      }

    },
    async add(addData) {
      const { id, index, fingerprint, attributes } = addData;

      if (!id || !(index > -1) || !fingerprint) return null;

      const registries = {
        previous: registry.cache.previous.tabs,
        removed: registry.cache.removed.tabs,
      };

      // Restore the tab if it was previously closed
      for (const r in registries) {
        if (registries[r] === null) continue;

        const guid = registry.query({ index, fingerprint }, r);

        if (guid) {
          const tabAttributes = registries[r][guid].attributes || {};
          registry.cache.current.tabs[guid] = { id, index, fingerprint, attributes: tabAttributes };
          delete registry.cache[r].tabs[guid];
          registry.tabs.writeToStorage();
          return;
        }
      }

      const newGuid = GUID();
      const targetRegistry = registry.cache.current.tabs;
      const newTab: Tab = { id, index, fingerprint, attributes };
      if (addData.window_id) {
        newTab.window_id = addData.window_id;
      }
      targetRegistry[newGuid] = newTab;
      await registry.tabs.writeToStorage();
      await registry.tabs.syncAllIndices({ fromIndex: index });
      return;
    },
    async remove(id) {
      if (isIterable(id)) {
        for (const i of id as number[]) {
          await registry.tabs.remove(i);
        }
        return;
      }

      const guid = registry.query({ id });
      if (!guid) return;

      registry.cache.removed.tabs[guid] = registry.cache.current.tabs[guid];
      delete registry.cache.current.tabs[guid];
      await registry.tabs.writeToStorage();

      const removedIndex = registry.cache.removed.tabs[guid].index;
      return removedIndex;
    },
    async writeToStorage() {
      await browser.storage.local.set({ registry_tabs: registry.cache.current.tabs });
    }
  },
    windows: {},
  listeners: {
    tabUpdated: async (id, tab: Browser.tabs.Tab) => {
      if (tab.url && tab.url.startsWith('chrome-extension://')) {
        if (tab.url.includes(browser.runtime.id)) {
          const fingerprint = stringToHash(`${tab.url},${tab.index}`);

          const attributeData = {
            title: tab.title,
            url: tab.url,
            favicon_url: tab.favIconUrl,
            pinned: tab.pinned,
          };
          const updateData = {
            id,
            index: tab.index,
            fingerprint,
            window_id: tab.windowId,
            attributes: attributeData,
          };

          registry.tabs.updateFingerprint(updateData);
        }
        return;
      }

      // Attempt to generate fingerprint
      browser.scripting.executeScript({
        target: { tabId: id },
        func: () => {
          return JSON.stringify([location.href, document.referrer, history.length]);
        }
      },
        (resultData) => {
          let fingerprint: Fingerprint;
          // console.warn(`Couldn't inject to get full fingerprint for [${tab.title}]. Using URL instead`)

          // script injection might fail the first time
          if (resultData !== undefined) {
            // replace by lodash isArray
            // const data: browser.scripting.InjectionResult[] = 'frameId' in resultData ? resultData : resultData[0];
            fingerprint = stringToHash(resultData[0].result as string);

          } else {
            fingerprint = stringToHash(tab.url as string);
          }

          const attributeData: TabAttributes = {
            title: tab.title,
            url: tab.url,
            favicon_url: tab.favIconUrl,
          };
          const updateData: Tab = {
            id,
            index: tab.index,
            fingerprint,
            window_id: tab.windowId,
            attributes: attributeData,
          };

          registry.tabs.updateFingerprint(updateData);
        }
      );
    },
  }
}

export default registry;
