<script lang="ts">
  import { dndzone } from 'svelte-dnd-action'
  import { onMount } from 'svelte';

  export let width = '';

  let parentRef: HTMLUListElement;

  let items = [];

  function handleSort(e: CustomEvent) {
    console.log(e.detail);
    items = e.detail.items;
  }

  onMount(() => {
    items = Array.from(parentRef.children)
      .map((ch) =>({ ...ch, id: ch.getAttribute('id') }));
    console.log(items);
  });

</script>

<ul
  class="content-list"
  style:width
  use:dndzone={{items}}
  on:consider={handleSort}
  on:finalize={handleSort}
  bind:this={parentRef}
>
  <slot />
</ul>

<style>
  .content-list {
    display: flex;
    flex-direction: column;
    gap: .3em;
    padding-inline: 0;
    min-width: var(--layout-min-item-width);
    max-width: var(--layout-max-item-width);
  }
</style>
