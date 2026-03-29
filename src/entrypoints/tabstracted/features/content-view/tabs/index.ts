import TabList from './TabList.svelte';
import TabItem from './TabItem.svelte';
import TabGroup from './TabGroup.svelte';
import tabItemOptions from './tab-item-options';
import tabGroupOptions from './tab-group-options';

const contextKey = Symbol('tabList');
export default TabList;
export { TabItem, TabGroup, contextKey, tabItemOptions, tabGroupOptions };
