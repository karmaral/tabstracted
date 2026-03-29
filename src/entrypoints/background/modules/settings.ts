import type { SettingsModule } from '$types/background/settings';
import { isEmpty } from '$libB/utils';
import defaultSettings from '$libB/default-settings';

const settings: SettingsModule = {
  cache: {},
  async init() {
    const storage = await browser.storage.local.get('user_settings');

    if (isEmpty(storage)) {
      settings.cache = defaultSettings;

      await settings.write();
      return;
    }

    settings.cache = storage.user_settings;
    await settings.write();
  },
  get() {
    return settings.cache;
  },
  async update(group, key, value) {
    settings.cache[group][key].value = value;
    await settings.write();
  },
  async write() {
    await browser.storage.local.set({ user_settings: settings.cache });
  }

}

export default settings;
