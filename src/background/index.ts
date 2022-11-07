import type { IStorage } from "$types";
import tabstracted from './tabstracted';
import { addListeners } from './listeners';


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ count: 0 } as IStorage, ({ count }: IStorage) => {
    console.log('background', count);
  });
});


addListeners();


