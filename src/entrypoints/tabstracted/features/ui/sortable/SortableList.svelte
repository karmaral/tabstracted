<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import Droppable from './Droppable.svelte';
  import SortableItem from './SortableItem.svelte';
  import {
    DndContext,
    DragOverlay,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
  } from '@dnd-kit-svelte/core';
  import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';
  import { dropAnimation, sensors } from './';
  import { crossfade } from 'svelte/transition';

  interface Props {
    tag: string;
    onDragStart: (event?: DragStartEvent) => void;
    onDragOver: (event?: DragEndEvent) => void;
    onDragEnd: (event?: DragEndEvent) => void;
    className: string;
    children: Snippet;
  };
  let {
    tag = 'div',
    onDragStart = () => void 0,
    onDragOver = () => void 0,
    onDragEnd = () => void 0,
    className = '',
    children,
  }: Props = $props();

  let ref: HTMLElement = $state(document.createElement('ul'));

  let items = $state()
  let activeId: string | null = $state(null);


  function handleDragStart(event: DragStartEvent) {
    activeId = event.active.id as string;
    onDragStart(event);
  }

  function handleDragOver(event: DragOverEvent): void {
    if (!event.over) return;

    onDragOver(event);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) return;

    onDragEnd(event);
    activeId = null; // might need to pass it through the callback
  }



  onMount(() => {
    // grid = new Muuri(listElem, {
    //   items: '.sortable-list-item',
    //   dragEnabled: true,
    //   layout: { fillGaps: true },
    // });

    // grid.on('dragStart', dragStart);
    // grid.on('dragEnd', dragEnd);

  });
</script>

<DndContext 
  {sensors} 
  onDragStart={handleDragStart} 
  onDragOver={handleDragOver} 
  onDragEnd={handleDragEnd}
>
  <svelte:element
    class="sortable-list {className}"
    this={tag}
    bind:this={ref}
  >
    {@render children?.()}
  </svelte:element>

  <DragOverlay>

  </DragOverlay>

</DndContext>
<style>
  .sortable-list {
    position: relative;
  }

</style>
