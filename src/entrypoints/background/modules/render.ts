import type {
  GroupRenderData,
  RenderModule,
  TabRenderData,
  WindowRenderData,
  WorkspaceListRenderData,
  WorkspaceRenderData,
} from '$types/render';
import type { Tab, TabAttributes, Group, GroupAttributes, Workspace } from '$types/models';
import settings from './settings';
import { CurrentRegistry, default as registry, WorkspaceRegistry } from './registry';
import { GUID } from '$lib/background/utils';


const render: RenderModule = {
  queue: [],
  lastUpdate: null,
  workspaceList() {
    const workspaces = Object.entries(registry.cache.current.workspaces);
    return workspaces.map(entry => {
      const guid = entry[0];
      const w = entry[1]
      return {
        guid,
        title: w.attributes.title,
        tabs: w.tabs.length,
        groups: w.groups.length,
      } as WorkspaceListRenderData
    });
  },
  serializeTabData(tabs) {
    const result: Tab[] = [];

    for (const tab of tabs) {
      const tabEntry: Tab = {
        id: tab.id!,
        index: tab.index,
        attributes: {} as TabAttributes,
        fingerprint: undefined,
      };

      if ('url' in tab) { // tab is Browser.tabs.Tab
        tabEntry.group_id = tab.groupId;
        tabEntry.window_id = tab.windowId;
        tabEntry.attributes.pinned = tab.pinned;
        tabEntry.attributes.title = tab.title;
        tabEntry.attributes.url = tab.url;
        tabEntry.attributes.favicon_url = tab.favIconUrl
        tabEntry.attributes.pinned = tab.pinned;
        tabEntry.attributes.suspended = tab.discarded;
      }
      else if ('attributes' in tab) { // tab is Tab
        Object.assign(tabEntry, tab);
      }

      result.push(tabEntry);
    }

    return result;
  },
  tabList(tabs) {
    const currentSettings = settings.cache;
    const hidePinned: boolean = currentSettings?.display?.hide_pinned_tabs.value;
    const tabList = [] as TabRenderData[];

    for (const tab of tabs) {
      const tabData: TabRenderData = {
        id: tab.id,
        index: tab.index,
        title: tab.attributes.title as string,
        url: tab.attributes.url as string,
        favicon_url: tab.attributes.favicon_url as string,
        pinned: tab.attributes.pinned as boolean,
        suspended: tab.attributes.suspended as boolean,
        group_id: tab.group_id as number,
        window_id: tab.window_id as number,
        guid: '',
      };

      tabList.push(tabData);
    }

    return tabList;
  },
  serializeGroupData(groups) {
    const result: Group[] = [];

    for (const group of groups) {
      const groupEntry: Group = {
        id: group.id!,
        window_id: group.windowId,
        attributes: {
          title: group.title,
          color: group.color,
          collapsed_browser: group.collapsed,
        } as GroupAttributes,
      };
      result.push(groupEntry);
    }

    return result;
  },
  groupList(groups, tabs) {
    const currentSettings = settings.cache;
    // TODO setting: mirror group collapsed state in UI
    const mirrorCollapsed: boolean = false;

    const groupMap: Record<number, Tab[]> = {};
    tabs.forEach((tab) => {
      const key = tab.group_id as number;
      if (!groupMap.hasOwnProperty(key)) {
        groupMap[key] = [tab];
        return;
      }
      groupMap[key].push(tab);
    });

    const groupList = [] as GroupRenderData[];
    for (const group of groups) {
      const groupTabs = groupMap[group.id];
      const groupData: GroupRenderData = {
        id: group.id,
        window_id: group.window_id,
        title: group.attributes.title as string,
        collapsed_browser: group.attributes.collapsed_browser,
        collapsed_ui: mirrorCollapsed,
        color: group.attributes.color,
        tabs_amount: groupTabs.length,
        tab_ids: groupTabs.map((t) => t.id),
        index_span: [groupTabs[0].index, groupTabs.at(-1)!.index],
      };

      groupList.push(groupData);
    }

    return groupList;
  },
  async createRenderData(windowId) {
    const workspace_list = render.workspaceList();
    if (!windowId) return { workspace_list };

    const workspaceGuid = WorkspaceRegistry.identify(windowId);

    if (workspaceGuid) {
      const workspace = CurrentRegistry.getWorkspace(workspaceGuid)!;

      const tabs = render.tabList(workspace.tabs);
      const groups = render.groupList(workspace.groups, workspace.tabs);

      const current_workspace: WorkspaceRenderData = {
        guid: workspace.guid,
        title: workspace.attributes.title || '',
        tabs,
        groups,
      };

      return { current_workspace, workspace_list };
    }

    // Populate with current window's tabs if there's no workspace found
    const browserTabs = await browser.tabs.query({ windowId });
    const browserGroups = await browser.tabGroups.query({ windowId });

    const serializedTabs = render.serializeTabData(browserTabs);
    const tabs = render.tabList(serializedTabs);

    const serializedGroups = render.serializeGroupData(browserGroups);
    const groups = render.groupList(serializedGroups, serializedTabs);

    const current_workspace: WorkspaceRenderData = {
      guid: GUID(),
      title: 'Unsaved Workspace', // TODO: i18n this string
      tabs,
      groups,
    };

    return { current_workspace, workspace_list };
  },
  // throttleRenderUpdate(windowId) {
  //   if (!render.last_update) {
      // render.last_update = Date.now();
  //     render.updateRenderData(windowId);
  //     return;
  //   }

  //   const MIN_REFRESH_INTERVAL = 50;
  //   const incoming = Date.now();
  //   render.queue.push(incoming);

  //   if (incoming - render.last_update < MIN_REFRESH_INTERVAL) {
  //     setTimeout(render.throttleRenderUpdate, MIN_REFRESH_INTERVAL);
  //     return;
  //   }
  //   render.last_update = Date.now();
  //   render.updateRenderData(windowId);
  // },
  async updateRenderData(windowId) {
    const data = await render.createRenderData(windowId);
    const updateData = {
      action: 'update:render',
      payload: {
        data,
        target_window_id: windowId,
      }
    }
    await browser.runtime.sendMessage(updateData);
  },
  async createWindowsRenderData() {
    const allWindows = await browser.windows.getAll({
      windowTypes: ['normal'],
      populate: true,
    });

    const renderData: WindowRenderData[] = []; 
    allWindows.forEach(w => {
      if (!w.tabs || !w.tabs.length) return;
      const id = w.id ?? -1;
      const labelTab = w.tabs.filter((t) => t.active)[0] || w.tabs.at(-1);
      const title = labelTab.title as string;
      renderData.push({ id, title });
    });

    return renderData;
  },
  async updateWindowsRenderData() {
    const data = await render.createWindowsRenderData();
    const updateData = {
      action: 'update:windows',
      payload: { data }
    };
    await browser.runtime.sendMessage(updateData);
  }
}

export default render;
