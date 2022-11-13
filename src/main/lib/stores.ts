import type { WaitingModeEnum } from '$types';
import type { RenderData, WorkspaceListRenderData, WorkspaceRenderData } from '$types/render';
import { writable, derived, type Writable } from 'svelte/store';

// placeholder

export const currentWindowId = writable<number>();
export const waitingMode = writable<WaitingModeEnum>();

export const renderData = writable<RenderData>({
  current_workspace: {},
  workspace_list: [],
} as RenderData);
export const workspaceList = derived<Writable<RenderData>, WorkspaceListRenderData[]>(
  renderData,
  ($renderData) => $renderData.workspace_list
);
export const currentWorkspace = derived<Writable<RenderData>, WorkspaceRenderData>(
  renderData,
  ($renderData) => $renderData.current_workspace);


export const storageLoaded = derived<Writable<RenderData>, boolean>(
  renderData,
  ($renderData) => {
    console.log({ $renderData });
    return Boolean($renderData.current_workspace.title);
  }
);

export const selectedTabs = writable<number[]>([]);
