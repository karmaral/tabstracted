<script lang="ts">
  import { useDroppable, type UseDroppableInput } from '@dnd-kit-svelte/svelte';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  interface Props extends UseDroppableInput {
    children: Snippet;
    class?: ClassValue;
    tag?: keyof HTMLElementTagNameMap;
  };
  let {
    children,
    class: className,
    tag = 'div',
    ...rest
  }: Props = $props();

  const { ref } = useDroppable(rest);
</script>

<svelte:element
  this={tag}
  class={['droppable', className]} 
  {@attach ref}
>
  {@render children()}
</svelte:element> 



<style>
  .droppable {
    display: flex;
    flex-direction: column;
    gap: inherit;
  }

</style>