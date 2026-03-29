<script lang="ts">
  import { useDroppable, type UseDroppableArguments } from '@dnd-kit-svelte/core';
  import type { Snippet } from 'svelte';


  interface Props extends UseDroppableArguments {
    children: Snippet;
  };
  let {
    children,
    ...rest
  }: Props = $props();

  const droppable = useDroppable(rest);
</script>

<ul 
  class="content-list"
  bind:this={droppable.node.current}
>
  {@render children?.()}
</ul>

<style>
  .content-list {
    display: grid;
    flex-direction: column;
    gap: .5rem;
    margin-block: 0;
    padding-inline: 0;
    width: 100%;
    min-width: var(--layout-min-item-width);
    max-width: var(--layout-max-item-width);
    position: relative;
  }
</style>