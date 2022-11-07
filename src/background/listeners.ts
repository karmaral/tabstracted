import registry from './modules/registry';
import render from './modules/render';
import * as utils from './modules/utils';
import tabstracted from './tabstracted';

async function onActionClicked() {
  try {
    await utils.createHubTab();
  } catch (e) {
    console.log('Error: ', e);
  }
}

async function onTabUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
  if (changeInfo.status === 'complete' || changeInfo.groupId) {
    registry.listeners.tabUpdated(tabId, tab);
    render.updateRenderData(tab.windowId);
  }
  // TODO: the skeleton loading could be called from here
}

function onTabMoved(tabId: number, moveInfo: chrome.tabs.TabMoveInfo) {
  registry.tabs.syncAllIndices();
  render.updateRenderData(moveInfo.windowId);
}

function onTabDetached(tabId: number, detachInfo: chrome.tabs.TabDetachInfo) {
  registry.tabs.syncAllIndices();
  render.updateRenderData(detachInfo.oldWindowId);
}

function onTabAttached(tabId: number, attachInfo: chrome.tabs.TabAttachInfo) {
  registry.tabs.syncAllIndices();
  render.updateRenderData(attachInfo.newWindowId);
}

function onTabRemoved(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) {
  registry.tabs.remove(tabId);
  render.updateRenderData(removeInfo.windowId);
}

function onGroupUpdated() {
  return;
}

function onWindowCreated(window: chrome.windows.Window) {
  return;
}

function onWindowRemoved(windowId: number) {
  return;
}


async function onStorageChanged(
  changes: { [key: string]: chrome.storage.StorageChange },
  namespace: 'sync' | 'local' | 'managed' | 'session'
) {
  if (namespace === 'local') {
    return;
  }
}

function onMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  switch (message.action) {
    case 'hub.tab.close':
      chrome.tabs.remove(message.tab_id);
      registry.tabs.remove(message.tab_id);
      break;
    case 'hub.tab.close_batch':
      break;
    case 'hub.tab.switch_to':
      chrome.tabs.update(message.tab_id, { active: true });
      break;
    case 'hub.storage.request_init':
      tabstracted.init()
        .then(() => render.updateRenderData(message.window_id));
      break;
    case 'hub.workspace.save':
      break;
    case 'hub.workspace.save_new':
      break;
    case 'hub.workspace.new_blank':
      break;
    case 'hub.workspace.open':
      break;
    case 'hub.workspace.open_new_window':
      break;
    case 'hub.workspace.delete':
      break;
    case 'hub.workspace.deactivate':
      break;
    case 'hub.workspace.switch_to':
      break;
    case 'hub.workspace.rename':
      break;
    case 'settings.get':
      break;
    case 'settings.update':
      break;
    default:
      break;
  }

  return true;
}


export function addListeners() {
  chrome.tabs.onUpdated.addListener(onTabUpdated);
  chrome.tabs.onMoved.addListener(onTabMoved);
  chrome.tabs.onDetached.addListener(onTabDetached);
  chrome.tabs.onAttached.addListener(onTabAttached);
  chrome.tabs.onRemoved.addListener(onTabRemoved);

  chrome.tabGroups.onUpdated.addListener(onGroupUpdated);


  chrome.windows.onCreated.addListener(onWindowCreated, { windowTypes: ['normal'] });
  chrome.windows.onRemoved.addListener(onWindowRemoved, { windowTypes: ['normal'] });

  chrome.storage.onChanged.addListener(onStorageChanged);

  chrome.runtime.onMessage.addListener(onMessage);

  chrome.action.onClicked.addListener(onActionClicked);
}
