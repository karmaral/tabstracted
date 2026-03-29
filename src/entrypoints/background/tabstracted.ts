import settingsModule from './modules/settings';
import { 
  default as registryModule,
  TabRegistry,
  PreviousRegistry,
} from './modules/registry';

const tabstracted = {
  async init() {
    if (Object.keys(PreviousRegistry.tabs).length) return;

    await settingsModule.init();
    await TabRegistry.init()
  },
}

export default tabstracted;
