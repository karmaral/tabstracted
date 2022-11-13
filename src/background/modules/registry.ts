import type { IRegistry } from '$types/registry';
import type { Tab, TabAttributes } from '$types/models';
import type { Fingerprint } from '$types/primitives';
import * as utils from './utils';

const registry: IRegistry = {
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
      registry.cache.current.windows = {};
      registry.cache.removed.windows = {};
      registry.cache.pending.windows = [];
      registry.cache.current.tabs = {};
      registry.cache.removed.tabs = {};
      registry.cache.pending.tabs = [];
    }
  },
  query(query, registry = 'current') {
    let { target, includeAll, mapTo, ...queryParams } = query;
    target = target ?? 'tabs';
    includeAll = includeAll ?? false;
    const targetRegistry = this.cache[registry][target];

    const result = Object.keys(targetRegistry).filter(guid => {
      for (const param in queryParams) {
        if (targetRegistry[guid][param] !== queryParams[param]) {
          return false;
        }
      }
      return true;
    });

    if (mapTo) {
      const mappedResult = result.map(guid => targetRegistry[guid][mapTo]);
      return mappedResult;
    }

    if (result.length > 1 && includeAll) {
      return result;
    }

    return result.length ? result[0] : null;
  },
  tabs: {
    async init() {
      const storage = await chrome.storage.local.get('registry_tabs');
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

      const allTabs = await chrome.tabs.query({});
      allTabs.forEach(tab => registry.listeners.tabUpdated(tab.id, tab));
    },
    async syncIndex(guid) {
      const id = registry.cache.current.tabs[guid].id;
      const tab = await chrome.tabs.get(id);
      registry.cache.current.tabs[guid].index = tab.index;
      await registry.tabs.write();
    },
    // TODO: This function might be too general / redundant
    async updateProps(guid, newProps = {}) {
      // TODO: replace w/ lodash
      if (utils.isEmpty(newProps)) return;

      for (const key in newProps) {
        const updatedValue = newProps[key];
        if (!updatedValue) continue;

        registry.cache.current.tabs[guid][key] = updatedValue;
      }

      await registry.tabs.write();
    },
    async syncAllIndices(options = { fromIndex: 0 }) {
      const targetRegistry = this.cache.current.tabs;
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
        await registry.tabs.write();
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
          registry.tabs.write();
          return;
        }
      }

      const newGuid = utils.GUID();
      const targetRegistry = registry.cache.current.tabs;
      const newTab: Tab = { id, index, fingerprint, attributes };
      if (addData.window_id) {
        newTab.window_id = addData.window_id;
      }
      targetRegistry[newGuid] = newTab;
      await registry.tabs.write();
      await registry.tabs.syncAllIndices({ fromIndex: index });
      return;
    },
    async remove(id) {
      if (utils.isIterable(id)) {
        for (const i of id as number[]) {
          await registry.tabs.remove(i);
        }
        return;
      }

      const guid = registry.query({ id });
      if (!guid) return;

      registry.cache.removed.tabs[guid] = registry.cache.current.tabs[guid];
      delete registry.cache.current.tabs[guid];
      await registry.tabs.write();

      const removedIndex = registry.cache.removed.tabs[guid].index;
      return removedIndex;
    },
    async write() {
      await chrome.storage.local.set({ registry_tabs: registry.cache.current.tabs });
    }
  },
  workspaces: {
    async init() {
      const storage = await chrome.storage.local.get('registry_workspaces');
      registry.cache.previous.workspaces = storage.registry_workspaces || {};

      // ...
    },
    identify(windowId) {
      const windowGuid = registry.query({ target: 'windows', id: windowId });

      if (windowGuid) {
        const window = registry.cache.current.windows[windowGuid];
        if (!window.workspace_id) return null;

        return window.workspace_id;
      }

      return null;
    },
  },
  windows: {},
  listeners: {
    tabUpdated: async (id, tab: chrome.tabs.Tab) => {
      if (tab.url.startsWith('chrome://')) {
        if (tab.url.includes(chrome.runtime.id)) {
          const fingerprint = utils.stringToHash(`${tab.url},${tab.index}`);

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
      chrome.scripting.executeScript({
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
            // const data: chrome.scripting.InjectionResult[] = 'frameId' in resultData ? resultData : resultData[0];
            fingerprint = utils.stringToHash(resultData[0].result);

          } else {
            fingerprint = utils.stringToHash(tab.url);
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
