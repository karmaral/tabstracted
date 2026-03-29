<script lang="ts">
  import './tabs.scss';
  import { onMount, tick, setContext } from 'svelte';
  import { crossfade } from 'svelte/transition';
  import { debugDnDState, menuState } from '$states';
  import type { GroupRenderData, TabRenderData } from '$types/render';
  import { tabListState } from './states.svelte';
  import {
    reorderTab,
    reorderGroup,
    groupTab,
  } from '$libF/middleware.svelte';
  import { TabItem, TabGroup, contextKey } from '.';
  import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit-svelte/sortable';
  import { Droppable, SortableItem, dropAnimation, sensors } from '$features/ui/sortable';
  import { 
    DndContext,
    DragOverlay,
		type DragStartEvent,
		type DragOverEvent,
		type DragEndEvent,
    closestCorners,
    pointerWithin,
    type Active,
    type Over,
  } from '@dnd-kit-svelte/core';
  import { sleep } from '$lib/utils';
  import { ContentList } from '$features/content-view';

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

  // let renderList: (TabRenderData | GroupRenderData)[] = $state([]);
  // let pauseRenderListSync: boolean = $state(false);

  let listRef: HTMLUListElement = $state(document.createElement('ul'));

  let activeSortableId: number | null = $state(null);
  // let activeSortableItem = $derived(renderList.find(item => item.id === activeSortableId) || null);
  let activeSortableItem: TabRenderData | GroupRenderData | null = $state(null);
  let activeSortableType: 'tab' | 'group' | null = $state(null);


  function updateRenderList() {
    const newList = [...groups, ...ungroupedTabs].sort((a, b) => {
      const aIdx = 'index_span' in a ? a.index_span[0] : a.index;
      const bIdx = 'index_span' in b ? b.index_span[0] : b.index;
      return aIdx - bIdx;
    });

    tabListState.renderList = newList;
  }

  function maybeRefreshRenderList() {
    if (tabListState.pauseRenderListSync) {
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

  // setContext(contextKey, { listHandler, refreshMainList });

  // TODO: This works as intended but I arrived to it kinda by accident
  // Figure it out + document it. 
  // Something to do with the i <= oldIndex || i >= newIndex I think
  function calculateNewTabIndex(oldIndex: number, newIndex: number): number {
    let offset = 0;
    tabListState.renderList.forEach((item, i) => {
      if (i <= oldIndex || i >= newIndex) return;
      if ('url' in item) {
        offset++;
      } else {
        offset += item.tab_ids.length;
      }
    });
    return newIndex + offset;
  }

  function getSortableInformation(active: Active, over: Over) {
    active = $state.snapshot(active);
    over = $state.snapshot(over);
    console.log('getSortableInformation', { active, over });
    const activeParentId: string = active.data?.parentId;
    const activeType =  active.data?.type as 'tab' | 'group';
    const activeRelativeIndex: number = active.data?.sortable.index;
    const overParentId: string = over.data?.parentId;
    const overType =  over.data?.type as 'tab' | 'group' | undefined;
    const overRelativeIndex: number = over.data?.sortable.index;
    const acceptsTab = over.data?.accepts?.includes('tab') ?? false;
    const acceptsGroup = over.data?.accepts?.includes('group') ?? false;
    return { 
      activeParentId,
      activeType,
      activeRelativeIndex,
      overParentId,
      overType,
      overRelativeIndex,
      acceptsTab,
      acceptsGroup,
    };
  }

  function handleDragStart(ev: DragStartEvent) {
    menuState?.closeAction();
    const { active } = ev;
    activeSortableId = active.id as number;
    activeSortableType = active.data?.type as 'tab' | 'group';
    activeSortableItem = tabListState.renderList.find((item) => item.id === active.id) ?? null;
    // pauseRenderListSync = true;

    debugDnDState.active = ev.active.id as string;
  }

  function handleDragOver(ev: DragOverEvent) {
    const { active, over } = ev;
    if (!over) return;

    debugDnDState.over = ev.over!.id as string;

    // const a = $state.snapshot(active);
    // const o = $state.snapshot(over);
    // console.log('dragOver', {active: a, over: o});
    const activeItem = tabListState.renderList.find(item => item.id === active.id);
    const overItem = tabListState.renderList.find(item => item.id === over.id);

    if (!activeItem || !overItem || activeItem === overItem) return;


    // handle container drag-over (TODO)
    // if (over.id === 'group') {
    //  activeItem. ???
    //  }
    // example just moves the item from one 'container' to another
    //


    // const newIndex = renderList.findIndex(item => item.id === over.id);


    // if ('url' in activeItem) {
    //   reorderTab(activeItem.id, newIndex);
    // } else {
    //   reorderGroup(activeItem.id, newIndex);
    // }

    // Update the activeItem to match the container it's being dragged over
    // activeItem.??? = overItem.???
  }

  async function handleDragEnd(ev: DragEndEvent) {
    const { active, over } = ev;
    if (!over) return;

    const { 
      activeParentId,
      activeType,
      activeRelativeIndex,
      overParentId,
      overType,
      overRelativeIndex,
      acceptsTab,
      acceptsGroup,
    } = getSortableInformation(active, over);

    // Didn't move
    if (activeRelativeIndex === overRelativeIndex && activeParentId === overParentId) {
      activeSortableId = null;
      return;
    }

    let oldIndex: number = activeRelativeIndex;
    let newIndex: number = overRelativeIndex;
    let newTabIndex: number;
    let activeItem: TabRenderData | GroupRenderData;

    tabListState.pauseRenderListSync = true;

    console.log('dragEnd', { active, over });

    // TODO: (because I'm out of time)
    // ev seems to have active/over.sortable, which has
    // containerId, index (relative to container), and items (all items in container)
    // I need to get to this with a clearer head, but this might be a good crutch/solution
    // Also activeParentId is not working because Item doesn't define parentId in useSortable

    if (activeParentId === 'toplevel') {
      activeItem = tabListState.renderList[oldIndex];
      console.log(activeItem);
      
      // Drop into Group (unfinished)
      if (activeType === 'tab' && overParentId.startsWith('group')) {
        const groupId = Number(overParentId.replace('group-', ''));
        const targetGroup = tabListState.renderList.find(item => item.id === groupId) as GroupRenderData;
        const [fromIndex, toIndex] = targetGroup.index_span;
        newTabIndex = fromIndex + overRelativeIndex;

        groupTab(activeItem.id, targetGroup.id);

        // TODO: Then somehow sort inside of the group (haven't figured out yet)
        // The data-altering code should be straightforward, but I'm not sure how to prompt
        // a user-based sorting inside the container (and coming from toplevel)
        // reoderTab(activeItem.id, newTabIndex);


        // Early return
        tabListState.pauseRenderListSync = false;
        return;
      }

      // Regular toplevel move
      newIndex = tabListState.renderList.findIndex(item => item.id === over.id);
      newTabIndex = calculateNewTabIndex(oldIndex, newIndex);

      // - visually move the items
      tabListState.renderList = arrayMove(tabListState.renderList, oldIndex, newIndex);

      // - update source data
      if (activeType === 'tab') {
        reorderTab(activeItem.id, newTabIndex);
      } else {
        reorderGroup(activeItem.id, newTabIndex);
      }

      // - wait until animation is completed to re-sync
      await sleep(dropAnimation.duration as number);
      tabListState.pauseRenderListSync = false;

      debugDnDState.active = '';
      debugDnDState.over = '';
      activeSortableId = null;
    }


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

	const [send, recieve] = crossfade({ duration: 100 });


  onMount(async () => {

  });

</script>

<DndContext 
  {sensors} 
  onDragStart={handleDragStart} 
  onDragOver={handleDragOver} 
  onDragEnd={handleDragEnd}
  collisionDetection={pointerWithin}
>
  <SortableContext 
    items={tabListState.renderList} 
    strategy={verticalListSortingStrategy}
  >
    <!-- TODO: Stretch the list DOM element so it can be targeted as 'toplevel' -->
    <!-- Either that or just find a cleaner/more elegant way to target toplevel -->
    <ContentList 
      id="toplevel" 
      data={{ 
        accepts: ['tab', 'group'],
        parentId: 'toplevel',
      }}
    >
        {#each tabListState.renderList as data (data.id)}
          {#if 'url' in data}
              <div in:recieve={{ key: data.id }} out:send={{ key: data.id }}>
                <TabItem {data} />
              </div>
          {:else}
            {@const childrenData = tabs.filter((t) => t.group_id === data.id)}
              <div in:recieve={{ key: data.id }} out:send={{ key: data.id }}>
                <TabGroup {data} {childrenData} />
              </div>
          {/if}
        {/each}
    </ContentList>
  </SortableContext>

  <DragOverlay 
    {dropAnimation} 
    wrapperElement="ul" 
    className="picked-up-wrapper"
  >
    {#if activeSortableItem && activeSortableId}
      {#if 'url' in activeSortableItem}
        <TabItem data={activeSortableItem} pickedUp={true}/>
      {:else}
        {@const childrenData = tabs.filter((t) => t.group_id === activeSortableItem?.id)}
        <TabGroup data={activeSortableItem} {childrenData} pickedUp={true}/>
      {/if}
    {/if}
  </DragOverlay>

</DndContext>

<style>
</style>
