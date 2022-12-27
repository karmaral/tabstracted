import type { WaitingModeEnum, IdListStore, MenuState } from '$types';
import type {
  RenderData,
  WindowRenderData,
  WorkspaceListRenderData,
  WorkspaceRenderData,
} from '$types/render';
import { writable, derived, type Writable } from 'svelte/store';

function createIdList<T>(initial: T[]): IdListStore<T> {
  const store = writable<T[]>(initial);
  const { subscribe, set, update } = store;
  const storeObj = {
    subscribe,
    add: (data: T | T[]) => {
      Array.isArray(data)
        ? update(prev => [...prev, ...data])
        : update(prev => [...prev, data]);
    },
    remove: (data: T | T[]) => {
      Array.isArray(data)
        ? update(prev => prev.filter(d => !data.includes(d)))
        : update(prev => prev.filter(d => d !== data));
    },
    toggle: (data: T | T[]) => {
      update(prev => {
        const result = [...prev];
        if (Array.isArray(data)) {
          data.forEach(id => {
            result.includes(id)
              ? result.splice(result.indexOf(id), 1)
              : result.push(id);
          });
        } else {
          prev.includes(data)
            ? result.splice(result.indexOf(data), 1)
            : result.push(data)
        }
        return result;
      });
    },
    clear: ()  => set([])
  };
  return storeObj;
}

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

export const selectedTabs = createIdList<number>([]);

export const allWindows = writable<WindowRenderData[]>([]);

export const menuState = writable<MenuState>();
