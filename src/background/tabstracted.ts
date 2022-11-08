import settings from './modules/settings';
import registry from './modules/registry';

const tabstracted = {
  async init() {
    if (registry.cache.previous.tabs !== null) return;

    await settings.init();
    await registry.tabs.init();

  },
}

export default tabstracted;
