<script lang="ts">
  import './tabs.scss';
  import { menuState } from '$states';
  import { crossfade } from 'svelte/transition';
  import type { GroupRenderData, TabRenderData } from '$types/render';
  import { renderListState } from './states.svelte';
  import { reorderTab, reorderGroup } from '$libF/middleware.svelte';
  import { TabItem, TabGroup } from '.';
  import type { ComponentProps } from 'svelte';
  import { DragDropProvider, DragOverlay }  from '@dnd-kit/svelte';
  import { pointerDistance } from '@dnd-kit/collision';
  import { Droppable, sensors } from '$features/ui/sortable';
  import { isSortable } from '@dnd-kit/svelte/sortable';
  import { computeReorderIndex } from './reorder-index';

  type DragDropProviderProps = ComponentProps<typeof DragDropProvider>;

  interface Props {
    tabs: TabRenderData[];
    groups: GroupRenderData[];
  };
  let {
    tabs,
    groups,
  }: Props = $props();

  let ungroupedTabs = $derived.by(() => {
    return tabs.filter((t) => t.group_id === -1);
  });
  let groupedTabs = $derived.by(() => {
    const result: Record<number, TabRenderData[]> = {};
    groups.forEach(g => {
      result[g.id] = tabs.filter(t => t.group_id === g.id);
    });
    return result;
  });

  // let renderList: (TabRenderData | GroupRenderData)[] = $state([]);
  // let pauseRenderListSync: boolean = $state(false);

  let listRef: HTMLUListElement = $state(document.createElement('ul'));

  let activeSortableItem: TabRenderData | GroupRenderData | null = $state(null);
  let activeInnerGroupSorting: number = $state(0);


  function updateRenderList() {
    const newList = [...groups, ...ungroupedTabs].sort((a, b) => {
      const aIdx = 'index_span' in a ? a.index_span[0] : a.index;
      const bIdx = 'index_span' in b ? b.index_span[0] : b.index;
      return aIdx - bIdx;
    });

    renderListState.root = newList;

    const groupRenderLists: Record<number, TabRenderData[]> = {};
    groups.forEach(group => {
      groupRenderLists[group.id] = tabs.filter(tab => tab.group_id === group.id);
    });
    renderListState.groups = groupRenderLists;
  }

  function maybeRefreshRenderList() {
    if (renderListState.pauseDataSync) {
      requestAnimationFrame(maybeRefreshRenderList);
    } else {
      updateRenderList();
    }
  }

  $effect(() => {
    if (tabs) {
      maybeRefreshRenderList();
    }
  });


  const handleDragStart: DragDropProviderProps['onDragStart'] = (ev) => {
    menuState?.closeAction();
    activeSortableItem = renderListState.root.find(item => item.id === ev.operation.source?.id) || null;
  }

  const handleDragEnd: DragDropProviderProps['onDragEnd'] = async (ev) => {
    const source = ev.operation.source;
    if (!isSortable(source)) return;

    const { initialGroup, group, initialIndex, index } = source.sortable;

    // Nothing changed
    if (initialGroup === group && initialIndex === index) return;

    const id = source.id as number;

    // Cross-container moves (in/out/between groups) — next pass.
    // TODO: grouping (root -> group), ungrouping (group -> root), inter-group moves.
    if (initialGroup !== 'root' || group !== 'root') return;

    // Toplevel reorder
    const targetIndex = computeReorderIndex(renderListState.root, id, index);
    renderListState.pauseDataSync = true;
    try {
      if (source.type === 'group') {
        await reorderGroup(id, targetIndex);
      } else {
        await reorderTab(id, targetIndex);
      }
    } finally {
      renderListState.pauseDataSync = false;
    }
  }

	const [send, receive] = crossfade({ duration: 100 });

</script>

<DragDropProvider
  {sensors}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
    <!-- collisionDetector={() => pointerDistance}
    collisionPriority={CollisionPriority.Lowest} -->
  <Droppable
    id="root"
    class="root sortable-list"
    tag="ul"
    collisionDetector={pointerDistance}
  >
    {#each renderListState.root as item, index (item.id)}
      {#if 'url' in item}
        <div in:receive={{ key: item.id }} out:send={{ key: item.id }}>
          <TabItem 
            data={item}
            sortableIndex={index}
          />
        </div>
      {:else}
        {@const childrenData = groupedTabs[item.id]}
        <div in:receive={{ key: item.id }} out:send={{ key: item.id }}>
          <TabGroup 
            data={item} 
            sortableIndex={index}
            {childrenData} 
            sortableDisabled={activeInnerGroupSorting === item.id}
          />
        </div>
      {/if}
    {/each}
  </Droppable>

  <DragOverlay 
    dropAnimation={{ duration: 250 }}
  >
    {#snippet children(source)}
      {#if source.type === 'tab'}
        {@const itemData = tabs.find(t => t.id === source.id)!}
        <TabItem 
          data={itemData} 
          sortableIndex={0}
          isPickedUp
          isDropping={source.status === 'dropping'}
        />
      {:else}
        {@const itemData = groups.find(g => g.id === source.id)!}
        {@const childrenData = $state.snapshot(tabs.filter(t => t.group_id === activeSortableItem?.id))}
        <TabGroup
          data={itemData} 
          sortableIndex={0}
          isPickedUp
          isDropping={source.status === 'dropping'}
          {childrenData} 
        />
      {/if}
    {/snippet}
  </DragOverlay>

</DragDropProvider>

<style>
  .root {
    padding-block: 1rem;
  }
  :global(.sortable-list) {
    display: grid;
    flex-direction: column;
    margin-block: 0;
    padding-inline: 0;
    width: 100%;
    min-width: var(--layout-min-item-width);
    max-width: var(--layout-max-item-width);
    position: relative;
  }
  :global(ul.picked-up-wrapper) {
    padding: unset;
    margin: unset;
    box-shadow: 0 .75rem 2rem -.75rem hsl(0 0% 0% / .25);
  }
</style>
