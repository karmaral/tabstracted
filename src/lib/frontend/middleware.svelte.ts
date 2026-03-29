import { browser } from 'wxt/browser';
import type { ExtensionActionMessage } from '$types';
import type { Tab, Workspace } from '$types/models';
import type { RenderData, TabRenderData, WindowRenderData } from '$types/render';
import {
  currentWindowId,
  allWindows,
  renderData,
  waitingMode,
  storageLoaded,
} from '$states';
import { ellipsis } from '$libF/utils';

// abstraction interface for dealing with background.js

function handleRenderUpdate(windowId: number, updatedRenderData: RenderData): void {
  if (windowId !== currentWindowId.value) return;

  renderData.current_workspace = updatedRenderData.current_workspace;
	renderData.workspace_list = updatedRenderData.workspace_list
}

function handleWindowsRenderUpdate(data: WindowRenderData[]) {
	allWindows.value = data;
}

function handleRenderMessage(
	message: ExtensionActionMessage,
	sender: Browser.runtime.MessageSender,
	sendResponse: (response?: any) => void
) {
  switch (message.action) {
    case 'update:render':
      handleRenderUpdate(message.payload.target_window_id, message.payload.data);
      break;
		case 'update:windows':
			handleWindowsRenderUpdate(message.payload.data);
			break;
    case 'set:waiting_mode':
      waitingMode.value = message.payload.state;
      break;
  }
}

export async function init() {
  browser.runtime.onMessage.addListener(handleRenderMessage);

  const window = await browser.windows.getCurrent();
  const { id } = window;
  currentWindowId.value = id as number;

  await browser.runtime.sendMessage({
    action: 'hub.storage.request_init',
		payload: {
			window_id: id,
		},
  });
}

export async function refresh() {
	if (!storageLoaded.value) return;
  const id = currentWindowId.value;

  await browser.runtime.sendMessage({
    action: 'hub.render.request_update',
		payload: {
			window_id: id,
		}
  });
}


/* TABS */
export async function closeTab(tab: TabRenderData): Promise<void> {
  await browser.runtime.sendMessage({
    action: 'hub.tab.close',
		payload: {
			tab_id: tab.id,
		},
  });
}

export async function batchCloseTabs(ids: number[]): Promise<void> {
	await browser.runtime.sendMessage({
		action: 'hub.tab.close_batch',
		payload: {
			tab_ids: ids
		},
	});
}

export function switchToTab(tab: TabRenderData) {
	browser.runtime.sendMessage({
		action: 'hub.tab.switch_to',
		payload: {
			tab_id: tab.id,
		},
	});
}

export async function reorderTab(tabId: number, newPos: number) {
  await browser.runtime.sendMessage({
    action: 'hub.tab.reorder',
		payload: {
			tab_id: tabId,
			new_pos: newPos,
		},
  });
}

export function moveToWindow(tabId: number, windowId: number) {
	browser.runtime.sendMessage({
		action: 'hub.tab.move_to_window',
		payload: {
			tab_id: tabId,
			window_id: windowId,
		},
	});
}

export async function batchMoveToWindow(tabIds: number[], windowId: number) {
	await browser.runtime.sendMessage({
		action: 'hub.tab.move_to_window_batch',
		payload: {
			tab_ids: tabIds,
			window_id: windowId,
		},
	});
}

export function suspendTab(tabId: number) {
  browser.runtime.sendMessage({
    action: 'hub.tab.suspend',
		payload: {
			tab_id: tabId,
		},
  });
}

export async function batchSuspendTabs(ids: number[]): Promise<void> {
  await browser.runtime.sendMessage({
    action: 'hub.tab.suspend_batch',
		payload: {
			tab_ids: ids,
		},
  });
}


/* GROUPS */
export async function groupTab(id: number, groupId: number) {
  await browser.runtime.sendMessage({
    action: 'hub.tab.group',
    tab_id: id,
    group_id: groupId,
  });
}

export async function batchGroupTabs(ids: number[], groupId: number) {
  await browser.runtime.sendMessage({
    action: 'hub.tab.group_batch',
    tab_ids: ids,
    group_id: groupId,
  });
}

export async function ungroupTab(id: number) {
  await browser.runtime.sendMessage({
    action: 'hub.tab.ungroup',
    tab_id: id,
  });
}

export async function batchUngroupTabs(ids: number[]) {
  await browser.runtime.sendMessage({
    action: 'hub.tab.ungroup_batch',
		payload: {
			tab_ids: ids,
		},
  });
}

export async function reorderGroup(groupId: number, newPos: number) {
  await browser.runtime.sendMessage({
    action: 'hub.group.reorder',
		payload: {
			group_id: groupId,
			new_pos: newPos,
		},
  });
}

export function collapseGroup(groupId: number, toggle: boolean) {
  browser.runtime.sendMessage({
    action: 'hub.group.collapse',
		payload: {
			group_id: groupId,
			toggle,
		},
  });
}


/* WORKSPACES */
export function saveWorkspace(workspace: Workspace) {
	browser.runtime.sendMessage({
		action: 'hub.workspace.save',
		payload: {
			updatedWorkspace: workspace
		},
	});
}

export function saveNewWorkspace() {
	browser.runtime.sendMessage({
		action: 'hub.workspace.saveNew'
	});
}

export function newBlankWorkspace() {
	browser.runtime.sendMessage({
		action: 'hub.workspace.new_blank'
	});
}

export function openWorkspace(id: string) {
	browser.runtime.sendMessage({
		action: 'hub.workspace.open',
		payload: {
			workspaceId: id,
		},
	});
}

export function openWorkspaceNewWindow(id: string) {
	browser.runtime.sendMessage({
		action: 'hub.workspace.openNewWindow',
		payload: {
			workspaceId: id,
		},
	});
}

export function deleteWorkspace(id: string) {
	browser.runtime.sendMessage({
		action: 'hub.workspace.delete',
		payload: {
			workspaceId: id
		},
	});
}

export function deactivateWorkspace(id: string) {
	browser.runtime.sendMessage({
		action: 'hub.workspace.deactivate',
		payload: {
			workspaceId: id
		},
	});
}

export function renameWorkspace(id: string, newTitle: string) {
	browser.runtime.sendMessage({
		action: 'hub.workspace.rename',
		payload: {
			workspaceId: id,
			updatedTitle: newTitle
		},
	});
}

export function switchToWorkspace(id: string): void {
	browser.runtime.sendMessage({
		action: 'hub.workspace.switchTo',
		payload: {
			workspaceId: id
		}
	});
}

/* MISC */
export function requestLogCache() {
	browser.runtime.sendMessage({
		action: 'request.logCache'
	});
}

export function requestClearRegistry() {
	browser.runtime.sendMessage({
		action: 'request.registry.clearLocal'
	});
}

export async function getUserSettings() {
	const settings = await browser.runtime.sendMessage({
		action: 'settings.get'
	});

	return settings.result;
}

export async function updateUserSettings(category: string, key: string, value: unknown) {
	const settings = await browser.runtime.sendMessage({
		action: 'settings.update',
		payload: {
			category,
			key,
			value,
		}
	});

	return settings.result;
}

export function undoLastAction() {
	browser.runtime.sendMessage({
		action: 'hub.undo_last_action',
		payload: {
			context: 'tab',
		}
	});
}
