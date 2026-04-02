import { GroupRenderData, TabRenderData } from '$types/render';

interface RenderListState {
  root: (TabRenderData | GroupRenderData)[];
  groups: Record<number, TabRenderData[]>;
  pauseDataSync: boolean;
}
export const renderListState: RenderListState = $state({
  root: [],
  groups: {},
  pauseDataSync: false,
});