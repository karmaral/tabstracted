<script lang="ts">
  import { onMount, tick, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Muuri from 'muuri';
  import type { GroupRenderData, TabRenderData } from '$types/render';
  import {
    reorderTab,
    reorderGroup,
  } from '$lib/middleware';
  import { TabItem, TabGroup, contextKey } from '.';
  import { getDiff, refreshList, ReorderHandler } from './tab-list-utils';

  export let tabs: TabRenderData[];
  export let groups: GroupRenderData[];

  $:  ungroupedTabs = tabs.filter((t) => t.group_id === -1);
  let renderList: (TabRenderData | GroupRenderData)[] = [];
  let listElem: HTMLUListElement;
  let listHandler = writable<Muuri>();
  function refreshMainList() {
    const refreshOpts = { listHandler: $listHandler, renderList, listElem };
    requestAnimationFrame(() => refreshList(refreshOpts));
  }

  function updateRenderList() {
    const newList = [...groups, ...ungroupedTabs]
      .sort((a, b) => {
        const aI = Array.isArray(a.index) ? a.index[0] : a.index;
        const bI = Array.isArray(b.index) ? b.index[0] : b.index;
        return aI - bI;
      });

    renderList = newList;

    refreshMainList();
  }

  $: if (tabs) { updateRenderList(); }

  setContext(contextKey, { listHandler, refreshMainList });
  onMount(async () => {
    let fromIndex: number | null = null;

    $listHandler = new Muuri(listElem, {
      items: '.item',
      dragEnabled: true,
      dragStartPredicate: (item, e) => {
        const elem = item.getElement();
        const { type } = elem.dataset

        if (e.isFinal) {
          Muuri.ItemDrag.defaultStartPredicate(item, e);
          return;
        }
        if ( type === 'group') {
          const subList = elem.querySelector('ul.content-list');
          const tgt = e.target as Node;
          if (subList.contains(tgt)) return false;
        }
        return Muuri.ItemDrag.defaultStartPredicate(item, e);
      },
      sortData: {
        index: (_item, elem) => {
          return parseInt(elem.dataset.index);
        }
      },
    });
    $listHandler
      .on('dragStart', (item, _e) => {
        console.log('dragStart');
        fromIndex = $listHandler.getItems().indexOf(item);
      });


    $listHandler.on('dragEnd', async (item, _e) => {
      console.log('dragEnd');
      const items = $listHandler.getItems();
      const newIndex = items.indexOf(item);

      let offset = 0;
      items.forEach((itm, i) => {
        if (i >= newIndex) return;
        const elem = itm.getElement();
        const { id, type } = elem.dataset;

        if (type === 'group') {
          const group = groups.find(g => g.id === parseInt(id));
          offset += group.tabs_amount;
        }
        if (type === 'tab') {
          offset++;
        }
      });


      const to = offset;

      const elem = item.getElement();
      const { type } = elem.dataset;
      const id = parseInt(elem.dataset.id);

      if (type === 'group') {
        const tab_ids = groups.find(g => g.id === id).tab_ids || [];
        console.log({id, tab_ids, to });
        await reorderGroup(id, tab_ids, to);
      }
      if (type === 'tab') {
        await reorderTab(id, to);
      }
    } );
  });

</script>
<ul class="content-list"
  bind:this={listElem}
>
  {#each renderList as data (data.id)}
    {#if 'url' in data}
      <TabItem {data} />
    {:else}
      {@const childrenData = tabs.filter((t) => t.group_id === data.id)}
      <TabGroup {data} {childrenData} />
    {/if}
  {/each}
</ul>

<!-- <ContentList
  bind:children={renderList}
  dropAction={handleReorder}
>
  {#each renderList as data (data?.id)}
    {#if data?.url}
      <TabItem {data} />
    {:else}
      {@const groupTabs = tabs.filter((t) => t.group_id === data?.id)}
      <TabGroup {data}>
        {#each groupTabs as data (data?.id)}
          <TabItem {data} />
        {/each}
      </TabGroup>
    {/if}
  {/each}
</ContentList> -->

<!-- <ContentList
  bind:children={ungroupedTabs}
  dropAction={handleReorder}
>
  {#each ungroupedTabs as data (data.id)}
    <TabItem {data} />
  {/each}
</ContentList> -->

<style>
  .content-list {
    position: relative;
    padding-inline: 0;
  }
</style>
