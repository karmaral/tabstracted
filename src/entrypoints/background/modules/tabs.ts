import type { TabsModule } from '$types/tabs';

/** Handles all tab-related operations */
const tabs: TabsModule = {
  async moveToWindow(tabIds, windowId) {
    let winId = windowId;
    let ids = Array.isArray(tabIds) ? tabIds : [tabIds];
    if (windowId === -1) {
      const [first, ...rest] = ids;
      const newWindow = await browser.windows.create({
        tabId: first,
        focused: false,
      });
      if (!rest.length) return;

      winId = newWindow.id!;
      ids = rest;
    }

    browser.tabs.move(ids, {
      windowId: winId,
      index: -1,
    });
  },
  async group(groupId, tabIds) {
    const options: Browser.tabs.GroupOptions = { 
      tabIds,
      groupId,
    };
    if (groupId === -1) {
      delete options['groupId'];
    }
    try {
      await browser.tabs.group(options);
    } catch (err) {
      console.log(err);
    }
  },
  async reorderGroup(groupId, index) {
    const tabs = await browser.tabs.query({ groupId });
    if (!tabs.length) return;
    const ids = tabs
      .sort((a, b) => a.index - b.index) // ensure order is by browser index first
      .map((t) => t.id!);
    await browser.tabs.move(ids, { index });
  },
  async suspend(tabIds) {
    const ids = Array.isArray(tabIds) ? tabIds : [tabIds];
    for (const id of ids) {
      try {
        await browser.tabs.discard(id);
      } catch (err) {
        console.log(err);
      }
    }
  }
};

export default tabs;