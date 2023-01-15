import type { ITabs } from '$types/tabs';

const tabs: ITabs = {
  async moveToWindow(tabIds, windowId) {
    let winId = windowId;
    let ids = Array.isArray(tabIds) ? tabIds : [tabIds];
    if (windowId === -1) {
      const [first, ...rest] = ids;
      const newWindow = await chrome.windows.create({
        tabId: first,
        focused: false,
      });
      if (!rest.length) return;
      winId = newWindow.id;
      ids = rest;
    }

    chrome.tabs.move(ids, {
      windowId: winId,
      index: -1,
    });
  },
  async suspend(tabIds) {
    const ids = Array.isArray(tabIds) ? tabIds : [tabIds];
    for (const id of ids) {
      try {
        await chrome.tabs.discard(id);
      } catch (e) {
        console.log(e);
      }
    }
  }
};

export default tabs;
