import type { ISettings } from '$types/settings';
import * as utils from './utils';
import defaultSettings from '../lib/default-settings';

const settings: ISettings = {
  cache: {},
  async init() {
    const storage = await chrome.storage.local.get('user_settings');

    if (utils.isEmpty(storage)) {
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
    await chrome.storage.local.set({ user_settings: settings.cache });
  }

}

export default settings;
