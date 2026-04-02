<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ScrollArea } from '$features/ui';

  interface Props {
    children: Snippet;
  };
  let { 
    children,
  }: Props = $props();

</script>

<div class="workspace-content">
  <div class="scroll-padding">
    <ScrollArea>
        {@render children?.()}
    </ScrollArea>
  </div>
</div>

<style>
.workspace-content {
    display: flex;
    flex: 1 1;
    min-height: 0;
    padding-inline: var(--layout-content-view-padding);
    max-width: 150ch;
    
  }

  .scroll-padding {
    width: 100%;
    padding-bottom: calc(var(--layout-action-bar-height) + 1rem);
  }
</style>