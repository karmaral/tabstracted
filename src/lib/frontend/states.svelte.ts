import { SvelteSet } from 'svelte/reactivity';
import type { ProgramState, ContentView, MenuState, WaitingModeEnum } from '$types';
import type { RenderData, WindowRenderData, WorkspaceListRenderData, WorkspaceRenderData } from '$types/render';


export const currentWindowId: { value: number } = $state({ value: -1 });
export const waitingMode: { value: WaitingModeEnum } = $state({value: null });

const defaultProgramState: ProgramState = {
  settingsOpen: false,
};
export const programState = $state(defaultProgramState);

const defaultMenuState: MenuState = {
  owner: document.createElement('div'),
  lastOwner: { 
    elem: document.createElement('div'),
    closeAction: () => void 0,
  },
  open: false,
  closeAction: () => void 0,
  entries: [],
  element: null,
};
export const menuState = $state(defaultMenuState);


export const renderData: RenderData = $state({
  current_workspace: {} as WorkspaceRenderData,
  workspace_list: [] as WorkspaceListRenderData[],
} as RenderData);

function createWorkspaceListDerived() {
  const value = $derived(renderData.workspace_list);
  return {
    get value() { return value; },
  };
}
export const workspaceList = createWorkspaceListDerived();

function createCurrentWorkspaceDerived() {
  const value = $derived(renderData.current_workspace);
  return {
    get value() { return value; },
  };
}
export const currentWorkspace = createCurrentWorkspaceDerived();


function createStorageLoadedDerived() {
  const value = $derived(Boolean(renderData.current_workspace.title));
  return {
    get value() { return value; },
  };
}
export const storageLoaded = createStorageLoadedDerived();

export const currentView: { value: ContentView } = $state({ value: 'tab' });
export const allWindows: { value: WindowRenderData[] } = $state({ value: [] });


interface IdList<T> {
  array: T[];
  add(data: T | T[]): void;
  remove(data: T | T[]): void;
  toggle(data: T | T[]): void;
  clear(): void;
  get length(): number;
};

function createIdList<T>(initial: T[]): IdList<T> {
  const setList: SvelteSet<T> = new SvelteSet<T>([...initial]);
  return {
    get array() {
      return Array.from(setList);
    },
    get length() {
      return setList.size;
    },
    add(data) {
      const addData = Array.isArray(data) ? data : [data];
      addData.forEach(d => {
        setList.add(d);
      });
    },
    remove(data) {
      const removeData = Array.isArray(data) ? data : [data];
      removeData.forEach(d => {
        setList.delete(d);
      });
    },
    toggle(data) {
      const updateData = Array.isArray(data) ? data : [data];
      updateData.forEach(d => {
        if (setList.has(d)) {
          setList.delete(d);
        } else {
          setList.add(d);
        }
      });
    },
    clear() {
      setList.clear();
    }
  }
}
export const selectedTabs = createIdList<number>([]);


export const debugDnDState = $state({active: '', over: ''});