import { addListeners } from './listeners';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  addListeners();
});
