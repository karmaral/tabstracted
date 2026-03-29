import { GroupRenderData, TabRenderData } from '$types/render';

interface TabListState {
  renderList: (TabRenderData | GroupRenderData)[];
  pauseRenderListSync: boolean;
}
export const tabListState: TabListState = $state({
  renderList: [],
  pauseRenderListSync: false,
});