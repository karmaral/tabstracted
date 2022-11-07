import type { IRender, TabRenderData, WorkspaceRenderData } from '$types/render';
import settings from './settings';
import registry from './registry';

const render: IRender = {
  workspaceList() {
    const workspaces = Object.entries(registry.cache.current.workspaces);
    return workspaces.map(entry => {
      const id = entry[0];
      const w = entry[1]
      return {
        id,
        title: w.attributes.title,
        tabs: w.tabs.length,
        groups: w.groups.length,
      }
    });
  },
  tabList(tabs) {
    const currentSettings = settings.cache;
    const hidePinned: boolean = currentSettings.display.hide_pinned_tabs.value;
    const tabList = [];

    for (const tab of tabs) {
      const tabEntry: Partial<TabRenderData> = {
        id: tab.id,
        index: tab.index,
      }

      if ('url' in tab) { // tab is chrome.tabs.Tab
        // this is a "hard" way. another way could be simply include the pinned attr
        // and hide/unhide based on class toggle
        if (hidePinned && tab.pinned) continue;

        tabEntry.title = tab.title;
        tabEntry.url = tab.url;
        tabEntry.favicon_url = tab.favIconUrl
        tabEntry.pinned = tab.pinned;

        tabList.push(tabEntry);
        continue;
      }
      else if ('attributes' in tab) { // tab is Tab
        if (hidePinned && tab.attributes.pinned) continue;

        tabEntry.title = tab.attributes.title;
        tabEntry.url = tab.attributes.url;
        tabEntry.favicon_url = tab.attributes.favicon_url;
        tabEntry.pinned = tab.attributes.pinned;

        tabList.push(tabEntry);
      }

    }

    return tabList;
  },
  async createRenderData(windowId) {
    const workspace_list = render.workspaceList();
    if (!windowId) return { workspace_list };

    const workspaceId = registry.workspaces.identify(windowId);

    if (workspaceId) {
      const workspace = registry.cache.current.workspaces[workspaceId];
      const current_workspace: WorkspaceRenderData = {
        id: workspace.id,
        title: workspace.attributes.title,
        tabs: workspace.tabs,
        groups: [],
      };

      return { current_workspace, workspace_list };
    }

    // Populate with current window's tabs if there's no workspace found
    const browserTabs = await chrome.tabs.query({ windowId });
    const tabs = render.tabList(browserTabs);

    const current_workspace: WorkspaceRenderData = {
      id: null,
      title: 'Unsaved Workspace',
      tabs: tabs,
      groups: [],
    };

    return { current_workspace, workspace_list };
  },
  async updateRenderData(windowId) {
    const data = await render.createRenderData(windowId);
    const updateData = {
      action: 'update:render',
      data,
      target_window_id: windowId,
    }
    await chrome.runtime.sendMessage(updateData);
  }
}

export default render;
