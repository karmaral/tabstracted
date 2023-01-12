import type {
  GroupRenderData,
  IRender,
  TabRenderData,
  WorkspaceRenderData,
} from '$types/render';
import type { Tab } from '$types/models';
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
    const tabList = [] as TabRenderData[];

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
        tabEntry.group_id = tab.groupId;
        tabEntry.suspended = tab.discarded;
      }
      else if ('attributes' in tab) { // tab is Tab
        if (hidePinned && tab.attributes.pinned) continue;

        tabEntry.title = tab.attributes.title;
        tabEntry.url = tab.attributes.url;
        tabEntry.favicon_url = tab.attributes.favicon_url;
        tabEntry.pinned = tab.attributes.pinned;
        tabEntry.group_id = tab.group_id;
        tabEntry.suspended = tab.attributes.suspended;
      }

      tabList.push(tabEntry as TabRenderData);
    }

    return tabList;
  },
  groupList(groups, tabs) {
    const groupList = [];

    // const groupIds = groups.map(g => g.id);

    for (const group of groups) {
      const groupEntry: Partial<GroupRenderData> = {
        id: group.id,
      };

      if ('title' in group) { // group is chrome.tabGroups.Group
        groupEntry.title = group.title;
        groupEntry.collapsed_ui = false;
        groupEntry.collapsed_browser = group.collapsed;
        groupEntry.color = group.color;

        const groupTabs = tabs.filter((t: Tab | chrome.tabs.Tab) => {
          if ('groupId' in t) {
            return t.groupId === group.id;
          }
          else if ('attributes' in t) {
            return t.group_id === group.id;
          }
        });
        groupEntry.tabs_amount = groupTabs.length;

        groupList.push(groupEntry);
        continue;
      }
      else if ('attributes' in group) { // group is Group
        groupEntry.title = group.attributes.title;
        groupEntry.collapsed_ui = group.attributes.collapsed_ui;
        groupEntry.collapsed_browser = group.attributes.collapsed_browser;
        groupEntry.color = group.attributes.color;

        groupList.push(groupEntry);
      }
    }

    return groupList;
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
    const browserGroups = await chrome.tabGroups.query({ windowId });

    const tabs = render.tabList(browserTabs);
    const groups = render.groupList(browserGroups, browserTabs);

    const current_workspace: WorkspaceRenderData = {
      id: null,
      title: 'Unsaved Workspace',
      tabs,
      groups,
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
