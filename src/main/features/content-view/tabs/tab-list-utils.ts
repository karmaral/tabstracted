import Muuri from 'muuri';
import type { GroupRenderData, TabRenderData } from '$types/render';


type RenderList = (TabRenderData | GroupRenderData)[];

interface GetDiffOptions {
  nested: boolean;
  indexOffset: number;
}

export function getDiff(
  freshData: RenderList,
  oldData: Muuri.Item[],
  options: GetDiffOptions) {
  let { nested, indexOffset } = options;
  nested = nested ?? false;
  indexOffset = indexOffset ?? 0;

  const indexTable = {};
  const result = [];

  freshData.forEach((itm, i) => {
    // this would break with:
    // - [from, to] indices (groups)
    // - if pinned is not shown --- though it might be solved
    // through simply hiding the pinned in muuri and disabling them
    indexTable[itm.id] = nested
      ? i
      : Array.isArray(itm.index) ? itm.index[0] : itm.index;

    // old
    // indexTable[itm.id] = i;
  });

  oldData.forEach((itm, i) => {
    const elem = itm.getElement();
    const id = parseInt(elem.dataset.id);
    const index = indexTable[id];

    if (index === undefined) {
      result.push({ id, type: 'removed' });
    } else if (index !== i) {
      result.push({ id, type: 'moved', info: { from: i, to: index } });
    }

    delete indexTable[id];
  });

  Object.keys(indexTable).forEach(id => {
    result.push({ id, type: 'added', info: { index: indexTable[id] } });
  });

  return result;
}

interface IRefreshListOptions {
  listHandler: Muuri;
  renderList: RenderList;
  listElem: HTMLElement;
  diffOptions?: GetDiffOptions;
}

export function refreshList(options: IRefreshListOptions) {
  const { listHandler, renderList, listElem } = options;
  let diffOptions = options.diffOptions ?? {} as GetDiffOptions;

  if (listHandler) {
    const itemList = listHandler.getItems();
    const diff = getDiff(renderList, itemList, diffOptions);

    if (diff.length) {
      diff.filter(i => i.type === 'removed')
        .forEach(i => {
          const item = itemList.find(itm => {
            const elem = itm.getElement();
            const id = parseInt(elem.dataset.id);
            return id === i.id;
          });
          if (item) {
            listHandler.remove([item], { layout: false });
          }
        });

      diff.filter(i => i.type === 'added')
        .forEach(i => {
          const elem = listElem.querySelector(`li.item[data-id="${i.id}"]`);
          listHandler.add(elem as HTMLElement,
            { index: i.info.index, layout: false });
        });

      listHandler.refreshSortData();
      listHandler.sort('index', { layout: false });
    }
    listHandler.refreshItems().layout();
  }
}
