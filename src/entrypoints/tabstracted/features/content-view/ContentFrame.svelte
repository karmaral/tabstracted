<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Svroller } from 'svrollbar';
  import BatchActionsBar from './batch-action-bar';

  interface Props {
    children: Snippet;
  };
  let { 
    children,
  }: Props = $props();

</script>

<div class="workspace-content">
  <Svroller width="100%" height="100%">
    {@render children?.()}
  </Svroller>
</div>

<style>
.workspace-content {
    display: flex;
    flex: 1 1;
    min-height: 0;
    padding-inline: var(--layout-content-view-padding);
    max-width: 150ch;
  }
</style>