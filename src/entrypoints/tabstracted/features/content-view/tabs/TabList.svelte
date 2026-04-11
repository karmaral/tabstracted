<script lang="ts">
  import './tabs.scss';
  import { onMount, tick, setContext } from 'svelte';
  import { crossfade } from 'svelte/transition';
  import { debugDnDState, menuState, selectedTabs } from '$states';
  import type { GroupRenderData, TabRenderData } from '$types/render';
  import { renderListState } from './states.svelte';
  import { reorderTab, reorderGroup, groupTab } from '$libF/middleware.svelte';
  import { TabItem, TabGroup, contextKey } from '.';
  // import { DragDropProvider, DragOverlay, KeyboardSensor, PointerSensor, type DragDropEvents } from '@dnd-kit-svelte/svelte';
  import type { ComponentProps } from 'svelte';
  import { DragDropProvider, DragOverlay }  from '@dnd-kit/svelte';
  import { CollisionPriority } from '@dnd-kit/abstract';
  // import { pointerDistance } from '@dnd-kit/collision';
  import { Droppable, sensors } from '$features/ui/sortable';
  import { sleep, clamp } from '$lib/utils';
  import { isSortableOperation } from '@dnd-kit/svelte/sortable';

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

  let activeSortableId: number | null = $state(null);
  let activeSortableItem: TabRenderData | GroupRenderData | null = $state(null);
  let activeSortableType: 'tab' | 'group' | null = $state(null);
  let activeSortableTarget: string = $state('');
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


  // TODO: This works as intended but I arrived to it kinda by accident
  // Figure it out + document it. 
  // Something to do with the i <= oldIndex || i >= newIndex I think
  function calculateNewTabIndex__v0(oldIndex: number, newIndex: number): number {
    let offset = 0;
    renderListState.root.forEach((item, i) => {
      if (i <= oldIndex || i >= newIndex) return;
      if ('url' in item) {
        offset++;
      } else {
        offset += item.tab_ids.length - 1; // the group itself doesn't count
      }
    });
    console.log(`newIndex: ${newIndex + offset} (${newIndex} + ${offset})`);
    return newIndex + offset;
  }

  function calculateTabIndex(fromDisplayIndex: number, toDisplayIndex: number) {
    // let realIndex = renderListIndex;
    // const groups = renderListState.topLevel.filter(item => {
    //   return 'index_span' in item;
    // });

    // groups.forEach(group => {
    //   const groupRenderIndex = renderListState.topLevel.findIndex(itm => itm.id === group.id);
    //   if (groupRenderIndex < renderListIndex) {
    //     realIndex += group.tab_ids.length - 1;
    //   }
    // });

    // case 1, forward
    // from 0 to 3 [0 1 2 3 X X]
    // case 2, backwards
    // from 3 to 1 [X 1 2 3 X X]
    // so I need min/max to determine edges, accounting for 0 and array.length

    // Assume target array is always root for now
    const targetArray = $state.snapshot(renderListState.root);
    const maxIndex = targetArray.length - 1;

    const safeFrom = clamp(fromDisplayIndex, 0, maxIndex);
    const safeTo = clamp(toDisplayIndex, 0, maxIndex);
    const segmentMin = Math.min(safeFrom, safeTo);
    const segmentMax = Math.max(safeFrom, safeTo);
    const segment = targetArray.slice(segmentMin, segmentMax + 1);
    const direction = fromDisplayIndex < toDisplayIndex ? 1 : -1;
    console.log({ safeFrom, safeTo, segmentMin, segmentMax, segment, direction });

    // Edge cases
    if (safeTo === 0) {
      console.log(`realIndex: ${safeTo}`);
      return safeTo;
    }

    let realIndex: number;
    if ('url' in targetArray[safeFrom]) {
      realIndex = targetArray[safeFrom].index;
    } else {
      realIndex = targetArray[safeFrom].index_span[0];
    }

    segment.forEach(item => {
      if ('url' in item) {
        realIndex += 1 * direction;
      } else {
        if (item.id === targetArray[safeFrom].id) {
          return;
        }
        const groupLength = item.tab_ids.length;
        const groupOffset = groupLength > 1 
          ? (direction > 0 ? groupLength : groupLength - 1) 
          // ? (groupLength - 1)
          : 1;
        console.log({ groupOffset });
        realIndex += groupOffset * direction;
      }
    });

    // for (let i = 0; i < newDisplayIndex && i < renderListState.topLevel.length; i++) {
    //   const item = renderListState.topLevel[i];
    //   console.log($state.snapshot(item));
    //   if ('index_span' in item) {
    //     realIndex += item.tab_ids.length;
    //   } else {
    //     realIndex += 1;
    //   }
    // }

    // old: 0, new: 1 breaks this (realIndex ends up at 0)
    // if (oldDisplayIndex < newDisplayIndex) {
    //   realIndex -= 1;
    // }

    console.log(`realIndex: ${realIndex}`);
    return realIndex;
  }

  // function getSortableInformation(active: Active, over: Over) {
  //   active = $state.snapshot(active);
  //   over = $state.snapshot(over);
  //   console.log('getSortableInformation', { active, over });
  //   const activeParentId: string = active.data?.parentId;
  //   const activeType =  active.data?.type as 'tab' | 'group';
  //   const activeRelativeIndex: number = active.data?.sortable.index;
  //   const overParentId: string = over.data?.parentId;
  //   const overType =  over.data?.type as 'tab' | 'group' | undefined;
  //   const overRelativeIndex: number = over.data?.sortable.index;
  //   const acceptsTab = over.data?.accepts?.includes('tab') ?? false;
  //   const acceptsGroup = over.data?.accepts?.includes('group') ?? false;
  //   return { 
  //     activeParentId,
  //     activeType,
  //     activeRelativeIndex,
  //     overParentId,
  //     overType,
  //     overRelativeIndex,
  //     acceptsTab,
  //     acceptsGroup,
  //   };
  // }

  const handleDragStart: DragDropProviderProps['onDragStart'] = (ev) => {
    menuState?.closeAction();
    activeSortableItem = renderListState.root.find(item => item.id === ev.operation.source?.id) || null;
    activeSortableId = (ev.operation.source?.id) as number || null;

    // this is very strict so it needs to go after
    if (!isSortableOperation(ev.operation)) return;
    const source = ev.operation.source!;

    activeSortableType = source.type as 'tab' | 'group';
    console.log('dragstart', ev.operation);

    // debugDnDState.active = ev.active.id as string;
  }

  const handleDragOver: DragDropProviderProps['onDragOver'] = (ev) => {
    if (!isSortableOperation(ev.operation)) return;
    const { source, target } = ev.operation
    if (!source || !target) return;

    // console.log(target);
    activeSortableTarget = `${target.type?.toString() || ''} - ${target.sortable?.group || ''}`;

    // TODO: I can use sortable.disabled for temporarily halting the parent from reacting
    // TODO: somehow wait a bit before sorting
    // so that the input can be guided to the correct place
    // (actually sort or just drop in group) 
  }

  const handleDragEnd: DragDropProviderProps['onDragEnd'] = async (ev) => {
    // console.log('op', (ev.operation.source as any)?.sortable?.draggable.status);
    if (ev.operation.canceled) {
      console.log('canceled');
      
    }
    if (
      (ev.operation.source && !ev.operation.target) ){
        // not entirely reliable. You can sort but 'drop in nowhere' and it will trigger anyway
      console.log('dropped in place');
    }
    
    if (!isSortableOperation(ev.operation)) return;
    const { source, target } = ev.operation;
    if (!source || !target) return;

    const newIndex = source.sortable.index;
    console.log({ 
      initial_index: source.sortable.initialIndex,
      new_index: source.sortable.index,
    });

    const sourceGroup = source.sortable.group;
    const targetGroup = target.id === 'root' ? target.id : target.sortable.group;

    // Didn't move
    if (source.sortable.initialIndex === newIndex && sourceGroup === targetGroup) {
      console.log('didnt move');
      activeSortableId = null;
      return;
    }

    renderListState.pauseDataSync = true;

    const id = source.id as number;

    // Sorting tabs inside a group
    if (sourceGroup !== 'root') {
      console.log('moving inner tabs | Implement');
      const groupId = Number((source.sortable?.group as string).replace('group-', ''));
      // renderListState.groups[groupId] = move(renderListState.groups[groupId], ev);


      // Implement: Ungroup into root
      if (targetGroup === 'root') {

      }

      // Implement: Move into another group
      if (targetGroup !== 'root' && targetGroup !== sourceGroup) {

      }

      renderListState.pauseDataSync = false;
      return;
    }

    // Toplevel sorting
    if (sourceGroup === 'root') {

      // Implement: Drop into group
      if (targetGroup !== 'root') {
        const groupId = Number((source.sortable?.group as string).replace('group-', ''));
        // Implement: calculate true index with group offsets

        // tabs moved in between a group's tabs get grouped into it.
        reorderTab(id, newIndex);
      }

      const newTabIndex = calculateTabIndex(source.sortable.initialIndex, source.index);
      if (source.type === 'group') {
        console.log(`moving group, newTabIndex: ${newTabIndex}`);
        reorderGroup(id, newTabIndex);
      } else if (source.type === 'tab') {
        console.log('moving tab (root)');
        reorderTab(id, newTabIndex);
      }

    }

    // renderListState.topLevel = move(renderListState.topLevel, ev);
    // renderlist move
    renderListState.pauseDataSync = false;
    activeSortableTarget = '';


    // --- OLD FUNCTION BELOW, EVALUATE & MIGRATE

    // TODO: (because I'm out of time)
    // ev seems to have active/over.sortable, which has
    // containerId, index (relative to container), and items (all items in container)
    // I need to get to this with a clearer head, but this might be a good crutch/solution
    // Also activeParentId is not working because Item doesn't define parentId in useSortable

    // if (activeParentId === 'toplevel') {
    //   activeItem = tabListState.renderList[oldIndex];
    //   console.log(activeItem);
      
    //   // Drop into Group (unfinished)
    //   if (activeType === 'tab' && overParentId.startsWith('group')) {
    //     const groupId = Number(overParentId.replace('group-', ''));
    //     const targetGroup = tabListState.renderList.find(item => item.id === groupId) as GroupRenderData;
    //     const [fromIndex, toIndex] = targetGroup.index_span;
    //     newTabIndex = fromIndex + overRelativeIndex;

    //     groupTab(activeItem.id, targetGroup.id);

    //     // TODO: Then somehow sort inside of the group (haven't figured out yet)
    //     // The data-altering code should be straightforward, but I'm not sure how to prompt
    //     // a user-based sorting inside the container (and coming from toplevel)
    //     // reoderTab(activeItem.id, newTabIndex);


    //     // Early return
    //     tabListState.pauseRenderListSync = false;
    //     return;
    //   }

    //   // Regular toplevel move
    //   newIndex = tabListState.renderList.findIndex(item => item.id === over.id);
    //   newTabIndex = calculateNewTabIndex(oldIndex, newIndex);

    //   // - visually move the items
    //   tabListState.renderList = arrayMove(tabListState.renderList, oldIndex, newIndex);

    //   // - update source data
    //   if (activeType === 'tab') {
    //     reorderTab(activeItem.id, newTabIndex);
    //   } else {
    //     reorderGroup(activeItem.id, newTabIndex);
    //   }

    //   // - wait until animation is completed to re-sync
    //   await sleep(dropAnimation.duration as number);
    //   renderListState.pauseDataSync = false;

    //   // debugDnDState.active = '';
    //   // debugDnDState.over = '';
    //   activeSortableId = null;
    // }


    // if (activeType === 'tab') {
    //   if (activeParentId === 'toplevel') {
    //     activeItem = renderList[oldIndex];

    //     // Drop in Group (unfinished)
    //     if (overParentId.startsWith('group')) {
    //       const groupId = Number(overParentId.split('group-')[1]);
    //       const targetGroup = renderList.find(item => item.id === groupId) as GroupRenderData;
    //       const [fromIndex, toIndex] = targetGroup.index_span;

    //       groupTab(activeItem.id, targetGroup.id);

    //       // TODO: Then somehow sort inside of the group (haven't figured out yet)
    //       // The data-altering code should be straightforward, but I'm not sure how to prompt
    //       // a user-based sorting inside the container (and coming from toplevel)
    //       // reoderTab(activeItem.id, newTabIndex);
    //       return;
    //     }

    //     // Regular toplevel move
    //     newIndex = renderList.findIndex(item => item.id === over.id);
    //     newTabIndex = calculateNewTabIndex(oldIndex, newIndex);

    //     return;
    //   }

    //   // Reoder child tabs from groups

    //   // Move out of groups
    //   if (overParentId === 'toplevel') {

    //   }
    // } else if (activeType === 'group') {
    //   // Groups can only move toplevel
    //   oldIndex =

    //   reorderGroup(activeItem.id, newTabIndex);
    // }


    // // visually move the items
    // renderList = arrayMove(renderList, oldIndex, newIndex);

    // // const overItem = $state.snapshot(renderList.find(item => item.id === over?.id));
    // // if (!overItem || activeSortableId === overItem.id) return;

    
    // // Toplevel only
    // oldIndex = renderList.findIndex(item => item.id === active.id);
    // newIndex = renderList.findIndex(item => item.id === over.id);
    // console.log('dragEnd', {oldIndex, newIndex}, getSortableInformation(active, over));

    // // TODO: For future me: This is a nice excercise, but I'm not at mental capacity right now
    // // First: Determine the offsets backwards and forwards, accounting for the groups in the middle.
    // // Might want to draw the logic in pen & paper
    // // Then, expand into groups (in and out)
    


    // activeItem = renderList[oldIndex]; // store item before moving
    // newTabIndex = calculateNewTabIndex(oldIndex, newIndex);

    // // visually move the items
    // renderList = arrayMove(renderList, oldIndex, newIndex);

    // // and update the source data
    // if ('url' in activeItem) {
    //   reorderTab(activeItem.id, newTabIndex);
    // } else {
    //   reorderGroup(activeItem.id, newTabIndex);
    // }
  }

	const [send, receive] = crossfade({ duration: 100 });

  onMount(async () => {

  });

</script>

<pre><code>
  {JSON.stringify(selectedTabs.array)}
</code></pre>

<DragDropProvider 
  {sensors}
  onDragStart={handleDragStart} 
  onDragOver={handleDragOver} 
  onDragEnd={handleDragEnd}
>
    <!-- collisionDetector={() => pointerDistance}
    collisionPriority={CollisionPriority.Lowest} -->
  <Droppable
    id="root"
    class="sortable-list"
    tag="ul"
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
        {@const a = console.log({ tabs: $state.snapshot(tabs), active: $state.snapshot(activeSortableItem) })}
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
