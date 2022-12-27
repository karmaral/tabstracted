import type { Tab, Workspace } from '$types/models';

export interface TabRenderData {
  id: number;
  index: number;
  title: string;
  url: string;
  favicon_url: string;
  pinned: boolean;
  group_id: number;
}

export interface GroupRenderData {
  id: number;
  title: string;
  collapsed_ui: boolean;
  collapsed_browser: boolean;
  color: chrome.tabGroups.ColorEnum;
  tabs_amount: number;
}

export interface WindowRenderData {
  id: number;
  title: string;
}

export interface WorkspaceListRenderData {
  id: string | null;
  title: string;
  tabs: number;
  groups: number;
}
export interface WorkspaceRenderData {
  id: string | null;
  title: string;
  tabs: TabRenderData[];
  groups: Array<T>;
}
export interface RenderData {
  current_workspace: WorkspaceRenderData;
  workspace_list: WorkspaceListRenderData[];
}

export interface IRender {
  workspaceList(): WorkspaceListRenderData[];
  tabList(tabs: Tab[] | chrome.tabs.Tab[]): TabRenderData[];
  groupList(
    groups: Group[] | chrome.tabsGroups.Group[],
    tabs: Tab[] | chrome.tabs.Tab[]): GroupRenderData[];
  createRenderData(windowId: number): Promise<Partial<RenderData>>;
  updateRenderData(windowId: number): Promise<void>
}
