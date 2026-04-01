<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ScrollArea } from 'bits-ui';

  interface Props {
    children: Snippet;
  };
  let { 
    children,
  }: Props = $props();

</script>

<div class="workspace-content">
  <div class="scroll-padding">
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        {@render children?.()}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  </div>
</div>

<style>
.workspace-content {
    display: flex;
    flex: 1 1;
    min-height: 0;
    padding-inline: var(--layout-content-view-padding);
    max-width: 150ch;

    & :global([data-scroll-area-root]) {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    & :global([data-scroll-area-viewport]) {
      width: 100%;
      height: 100%;
    }

    & :global([data-scroll-area-scrollbar]) {
      width: .625rem;
      transition: all .2s;
      background-color: oklch(0 0 0 / .075);
      border-radius: 1rem;

      &:hover {
        width: .75rem;
      }
    }
    & :global([data-scroll-area-thumb]) {
      display: flex;
      background: rgb(173, 173, 173);
      border-radius: 1rem;
      user-select: none;
      touch-action: none;

    }
  }

  .scroll-padding {
    width: 100%;
    padding-bottom: calc(var(--layout-action-bar-height) + 1rem);
  }
</style>