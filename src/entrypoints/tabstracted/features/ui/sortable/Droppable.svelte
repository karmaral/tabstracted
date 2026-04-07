<script lang="ts">
  import { createDroppable, type CreateDroppableInput } from '@dnd-kit/svelte';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  interface Props extends CreateDroppableInput {
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

  const droppable = createDroppable({ 
    get id() { return rest.id },
    get type() { return rest.type },
    get accept() { return rest.accept },
    get data() { return rest.data },
    get disabled() { return rest.disabled },
    get collisionDetector() { return rest.collisionDetector },
    get collisionPriority() { return rest.collisionPriority },
    get effects() { return rest.effects },
  });
</script>

<svelte:element
  this={tag}
  class={['droppable', className]} 
  {@attach droppable.attach}
>
  {@render children()}
</svelte:element> 
