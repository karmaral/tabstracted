<script lang="ts">
  import { type UniqueIdentifier } from '@dnd-kit-svelte/core';
  import { useSortable } from '@dnd-kit-svelte/sortable';
  import { CSS, styleObjectToString } from '@dnd-kit-svelte/utilities';
  import type { Snippet } from 'svelte';

  interface Props {
    id: UniqueIdentifier;
    tag?: string;
    className?: string;
    children: Snippet;
    placeholder?: Snippet;
  };
  let {
    id,
    tag = 'div',
    className = '',
    children,
    placeholder,
  }: Props = $props();

  const { 
    attributes,
    listeners,
    node,
    transform,
    transition,
    isDragging,
    isSorting 
  } = useSortable({ id });

  const style = $derived(
    styleObjectToString({
      transform: CSS.Transform.toString(transform.current),
      transition: isSorting.current ? transition.current : undefined,
      zIndex: isDragging.current ? 1 : undefined,
    })
  );

</script>

<svelte:element
  this={tag}
  class="sortable-item {className}"
>
  <div 
    class="sortable-item__content" 
    class:invisible={isDragging.current}
    bind:this={node.current}
    {...listeners.current}
    {...attributes.current}
  >
    {@render children?.()}
  </div>

  {#if isDragging.current}
    <div class="sortable-item__placeholder">
      {@render placeholder?.()}
    </div>
  {/if}
</svelte:element>

<style>
  .sortable-item {
    position: relative;
    width: 100%;
  }
  .sortable-item__content {
    position: relative;
    user-select: none;
  }
  .sortable-item__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
  }

</style>
