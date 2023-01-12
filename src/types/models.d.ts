
export interface RegistryEntry {
  fingerprint: string | undefined;
  attributes: unknown;
}

export interface Workspace {
  id: GUID | undefined;
  attributes: WorkspaceAttributes;
}
export interface WorkspaceAttributes {
  title: string | undefined;
}

export interface Tab {
  id: number;
  index: number;
  fingerprint: number | undefined;
  attributes: TabAttributes;
  group_id?: number;
  window_id?: number;
  window_guid?: GUID | undefined;
  group_guid?: GUID | undefined;
}

export interface TabAttributes {
  title?: string | undefined;
  url?: string | undefined;
  favicon_url?: string | undefined;
  pinned?: boolean;
  suspended?: boolean;
  [key: string]: unknown;
}
