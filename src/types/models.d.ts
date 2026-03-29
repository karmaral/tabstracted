
export interface RegistryEntry {
  fingerprint: string | undefined;
  attributes: unknown;
};

export interface Workspace {
  guid: GUID;
  tabs: Tab[];
  groups: Group[];
  attributes: WorkspaceAttributes;
};

export interface WorkspaceAttributes {
  title?: string;
};

export interface Window {
  id: number;
  guid: GUID;
  workspace_guid: GUID | undefined;
};

export interface Group {
  id: number;
  window_id: number;
  window_guid?: GUID | undefined;
  group_guid?: GUID | undefined;
  attributes: GroupAttributes;
};

export interface GroupAttributes {
  title?: string;
  color: Browser.tabGroups.Color;
  collapsed?: boolean;
  collapsed_browser: boolean;
};

export interface Tab {
  id: number;
  index: number;
  fingerprint: number | undefined;
  group_id?: number;
  window_id?: number;
  window_guid?: GUID | undefined;
  group_guid?: GUID | undefined;
  attributes: TabAttributes;
}

export interface TabAttributes {
  title?: string | undefined;
  url?: string | undefined;
  favicon_url?: string | undefined;
  pinned?: boolean;
  suspended?: boolean;
  [key: string]: unknown;
}
