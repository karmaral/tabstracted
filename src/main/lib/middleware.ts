import type { Tab, Workspace } from '$types/models';
import type { RenderData, TabRenderData } from '$types/render';
import { get } from 'svelte/store';
import {
  currentWindowId as $currentWindowId,
  allWindows as $allWindows,
  renderData as $renderData,
  waitingMode as $waitingMode,
  storageLoaded as $storageLoaded,
} from '$lib/stores';

// abstraction interface for dealing with background.js

function handleRenderUpdate(windowId: number, updatedRenderData: RenderData): void {
  console.log({ updatedRenderData, windowId: get($currentWindowId) });
  if (windowId !== get($currentWindowId)) return;

  $renderData.set(updatedRenderData);
}
function handleRenderMessage(message, sender, sendResponse) {
  switch (message.action) {
    case 'update:render':
      handleRenderUpdate(message.target_window_id, message.data);
      break;
    case 'set:waiting_mode':
      $waitingMode.set(message.state);
      break;
  }
}
export async function init() {
  chrome.runtime.onMessage.addListener(handleRenderMessage);

  const window = await chrome.windows.getCurrent();
  const { id } = window;
  $currentWindowId.set(id);

  const allWindows = await chrome.windows.getAll({
    windowTypes: ['normal'],
    populate: true,
  });
  $allWindows.set(allWindows.map((w) => {
    const labelTab = w.tabs.filter((t) => t.active)[0] || w.tabs[w.tabs.length - 1];
    const maxChars = 48;
    const label = labelTab.title.length < maxChars
      ? labelTab.title
      : `${labelTab.title.substring(0, maxChars)}...`;
    return {
      id: w.id,
      title: label,
    };
  }));

  await chrome.runtime.sendMessage({
    action: 'hub.storage.request_init',
    window_id: id,
  });
}
export async function refresh() {
  if (!get($storageLoaded)) return;
  const id = get($currentWindowId);
  await chrome.runtime.sendMessage({
    action: 'hub.render.request_update',
    window_id: id,
  });
}

export async function closeTab(tab: TabRenderData): Promise<void> {
  console.log(`hub: closing tab ${tab.title} | ${tab.id}`);
  await chrome.runtime.sendMessage({
    action: 'hub.tab.close',
    tab_id: tab.id,
  });
}
export async function batchCloseTabs(ids: number[]): Promise<void> {
	console.log(`hub: batch closing ${ids.length} tabs`);
	await chrome.runtime.sendMessage({
		action: 'hub.tab.close_batch',
		tab_ids: ids
	});
	console.log(`batchCloseTabs FINISHED`);
}
export function switchToTab(tab: TabRenderData) {
	console.log(`hub: switching to tab ${tab.title} | ${tab.id}`);
	chrome.runtime.sendMessage({
		action: 'hub.tab.switch_to',
		tab_id: tab.id,
	});
}
export function moveToWindow(tabId: number, windowId: number) {
	chrome.runtime.sendMessage({
		action: 'hub.tab.move_to_window',
		tab_id: tabId,
    window_id: windowId,
	});
}
export function collapseGroup(groupId: number, toggle: boolean) {
  chrome.runtime.sendMessage({
    action: 'hub.group.collapse',
    group_id: groupId,
    toggle,
  });
}
export function saveWorkspace(workspace: Workspace) {
	console.log(`hub: updated active workspace (saved)`, workspace);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.save',
		updatedWorkspace: workspace
	});
}
export function saveNewWorkspace() {
	console.log(`hub: new workspace from active`);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.saveNew'
	});
}
export function newBlankWorkspace() {
	console.log(`hub: new blank workspace`);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.new_blank'
	});
}
export function openWorkspace(id: string) {
	console.log(`hub: open workspace ${id}`);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.open',
		workspaceId: id,
	});
}
export function openWorkspaceNewWindow(id: string) {
	console.log(`hub: open workspace ${id} (new window)`);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.openNewWindow',
		workspaceId: id,
	});
}
export function deleteWorkspace(id: string) {
	console.log(`hub: delete workspace ${id}`);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.delete',
		workspaceId: id
	});
}
export function deactivateWorkspace(id: string) {
	console.log(`hub: deactivate workspace ${id}`);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.deactivate',
		workspaceId: id
	});
}
export function renameWorkspace(id: string, newTitle: string) {
	console.log(`hub: rename workspace ${id}`);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.rename',
		workspaceId: id,
		updatedTitle: newTitle
	});
}
export function switchToWorkspace(id: string): void {
	console.log(`hub: switch to workspace ${id}`);
	chrome.runtime.sendMessage({
		action: 'hub.workspace.switchTo',
		workspaceId: id
	});
}
export function requestLogCache() {
	console.log(`hub: request log cache`);
	chrome.runtime.sendMessage({
		action: 'request.logCache'
	});
}
export function requestClearRegistry() {
	console.log(`hub: request clear registry`);
	chrome.runtime.sendMessage({
		action: 'request.registry.clearLocal'
	});
}
export async function getUserSettings() {
	console.log(`hub: request user settings`);
	const settings = await chrome.runtime.sendMessage({
		action: 'settings.get'
	});

	console.log('preferences > response', settings);

	return settings.result;
}
export async function updateUserSettings(category, key, value) {
	console.log(`hub: update user settings`);
	const settings = await chrome.runtime.sendMessage({
		action: 'settings.update',
		category: category,
		key: key,
		value: value
	});

	console.log('preferences > response', settings);
	return settings.result;
}
