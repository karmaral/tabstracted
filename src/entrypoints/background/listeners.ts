import registryModule from './modules/registry';;
import renderModule from './modules/render';
import tabsModule from './modules/tabs';
import tabstracted from './tabstracted';
import { createHubTab } from '$libB/utils';

async function onActionClicked() {
  try {
    await createHubTab();
  } catch (e) {
    console.log('Error: ', e);
  }
}

async function onTabUpdated(tabId: number, changeInfo: Browser.tabs.TabChangeInfo, tab: Browser.tabs.Tab) {
  if (changeInfo.status === 'loading') return;

  // registry.listeners.tabUpdated(tabId, tab);
  renderModule.updateRenderData(tab.windowId);
  // TODO: the skeleton loading could be called from here
}

function onTabMoved(tabId: number, moveInfo: Browser.tabs.TabMoveInfo) {
  // registry.tabs.syncAllIndices();
  renderModule.updateRenderData(moveInfo.windowId);
}

function onTabDetached(tabId: number, detachInfo: Browser.tabs.TabDetachInfo) {
  // registry.tabs.syncAllIndices();
  renderModule.updateRenderData(detachInfo.oldWindowId);
}

function onTabAttached(tabId: number, attachInfo: Browser.tabs.TabAttachInfo) {
  // registry.tabs.syncAllIndices();
  renderModule.updateRenderData(attachInfo.newWindowId);
}

function onTabRemoved(tabId: number, removeInfo: Browser.tabs.TabRemoveInfo) {
  // registry.tabs.remove(tabId);
  renderModule.updateRenderData(removeInfo.windowId);
}

function onGroupUpdated(group: Browser.tabGroups.TabGroup) {
  //registry.groups.update(group);
  renderModule.updateRenderData(group.windowId);
}

function onWindowCreated(_window: Browser.windows.Window) {
  // update registry too
  renderModule.updateWindowsRenderData();
  return;
}

function onWindowRemoved(_windowId: number) {
  // update registry too
  renderModule.updateWindowsRenderData();
  return;
}


async function onStorageChanged(
  changes: { [key: string]: Browser.storage.StorageChange },
  namespace: 'sync' | 'local' | 'managed' | 'session'
) {
  if (namespace === 'local') {
    return;
  }
}

async function onMessage(message: any, sender: Browser.runtime.MessageSender, sendResponse: (response?: any) => void) {
  let response: unknown;
  console.log([message.action, message.payload]);
  const { payload, action } = message;
  switch (action) {
    case 'hub.tab.close':
      browser.tabs.remove(payload.tab_id);
      registryModule.tabs.remove(payload.tab_id);
      break;
    case 'hub.tab.close_batch':
      await browser.tabs.remove(payload.tab_ids);
      await registryModule.tabs.remove(payload.tab_ids);
      response = true;
      break;
    case 'hub.tab.switch_to':
      browser.tabs.update(payload.tab_id, { active: true });
      break;
    case 'hub.tab.reorder':
      console.log(message);
      await browser.tabs.move(payload.tab_id, { index: payload.new_pos });
      response = true;
      break;
    case 'hub.tab.reorder_batch':
      await browser.tabs.move(payload.tab_ids, { index: payload.new_pos });
      response = true;
      break;
    case 'hub.tab.move_to_window':
      tabsModule.moveToWindow(payload.tab_id, payload.window_id);
      break;
    case 'hub.tab.move_to_window_batch':
      await tabsModule.moveToWindow(payload.tab_ids, payload.window_id);
      response = true;
      break;
    case 'hub.tab.suspend':
      tabsModule.suspend(payload.tab_id);
      break;
    case 'hub.tab.suspend_batch':
      await tabsModule.suspend(payload.tab_ids);
      response = true;
      break;
    case 'hub.tab.group':
      tabsModule.group(payload.group_id, payload.tab_id);
      response = true;
      break;
    case 'hub.tab.group_batch':
      tabsModule.group(payload.group_id, payload.tab_ids);
      response = true;
      break;
    case 'hub.tab.ungroup':
      await browser.tabs.ungroup(payload.tab_id);
      response = true;
      break;
    case 'hub.tab.ungroup_batch':
      await browser.tabs.ungroup(payload.tab_ids);
      response = true;
      break;
    case 'hub.group.reorder':
      await tabsModule.reorderGroup(payload.group_id, payload.new_pos)
      response = true;
      break;
    case 'hub.group.collapse':
      browser.tabGroups.update(payload.group_id, {
        collapsed: payload.toggle
      });
      break;
    case 'hub.storage.request_init':
      await tabstracted.init();
      renderModule.updateRenderData(payload.window_id);
      renderModule.updateWindowsRenderData();
      break;
    case 'hub.render.request_update':
        renderModule.updateRenderData(payload.window_id);
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

  return { response };
}


export function addListeners() {
  browser.tabs.onUpdated.addListener(onTabUpdated);
  browser.tabs.onMoved.addListener(onTabMoved);
  browser.tabs.onDetached.addListener(onTabDetached);
  browser.tabs.onAttached.addListener(onTabAttached);
  browser.tabs.onRemoved.addListener(onTabRemoved);

  browser.tabGroups.onUpdated.addListener(onGroupUpdated);

  browser.windows.onCreated.addListener(onWindowCreated, { windowTypes: ['normal'] });
  browser.windows.onRemoved.addListener(onWindowRemoved, { windowTypes: ['normal'] });

  browser.storage.onChanged.addListener(onStorageChanged);

  browser.runtime.onMessage.addListener(onMessage);

  browser.action.onClicked.addListener(onActionClicked);
}
