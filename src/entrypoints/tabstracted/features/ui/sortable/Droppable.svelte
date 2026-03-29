<script lang="ts">
  import { useDroppable, type UseDroppableArguments } from '@dnd-kit-svelte/core';
  import { clsx, type ClassValue } from 'clsx';
  import type { Snippet } from 'svelte';

  interface Props extends UseDroppableArguments {
    children: Snippet;
    class?: ClassValue;
  };
  let {
    children,
    class: className,
    ...rest
  }: Props = $props();

  const droppable = useDroppable(rest);
</script>

<div class={clsx(['droppable', className])} bind:this={droppable.node.current}>
  {@render children()}
</div>



<style>
  .droppable {
    display: flex;
    flex-direction: column;
    gap: inherit;
  }

</style>