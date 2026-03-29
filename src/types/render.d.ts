import type { Tab, Group, Workspace } from '$types/models';

export interface TabRenderData {
  guid?: string;
  /** The id, assigned by the browser */
  id: number;
  /** The group id, assigned by the browser */
  group_id: number;
  window_id: number;
  index: number;
  title: string;
  url: string;
  favicon_url: string;
  pinned: boolean;
  suspended: boolean;
}

export interface GroupRenderData {
  guid?: string;
  id: number;
  window_id: number;
  title: string;
  index_span: [first: number, last: number];
  collapsed_ui: boolean;
  collapsed_browser: boolean;
  color: Browser.tabGroups.Color;
  tabs_amount: number;
  tab_ids: number[];
}

export interface WindowRenderData {
  id: number;
  title: string;
}

export interface WorkspaceListRenderData {
  guid: string;
  title: string;
  tabs: number;
  groups: number;
}
export interface WorkspaceRenderData {
  guid: string;
  title: string;
  tabs: TabRenderData[];
  groups: GroupRenderData[];
}
export interface RenderData {
  current_workspace: WorkspaceRenderData;
  workspace_list: WorkspaceListRenderData[];
}

export interface RenderModule {
  queue: [];
  lastUpdate: number | null
  workspaceList(): WorkspaceListRenderData[];
  serializeTabData(tabs: Browser.tabs.Tab[] | Tab[]): Tab[];
  tabList(tabs: Tab[]): TabRenderData[];
  serializeGroupData(groups: Browser.tabGroups.TabGroup[]): Group[];
  groupList(groups: Group[], tabs: Tab[]): GroupRenderData[];
  createRenderData(windowId: number): Promise<Partial<RenderData>>;
  updateRenderData(windowId: number): Promise<void>
  createWindowsRenderData(): Promise<WindowRenderData[]>;
  updateWindowsRenderData(): Promise<void>
}
