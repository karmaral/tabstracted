import TabList from './tab-list.svelte';
import TabItem from './tab-item.svelte';
import TabGroup from './tab-group.svelte';

const contextKey = Symbol('tabList');
export default TabList;
export { TabItem, TabGroup, contextKey };
