<script lang="ts">
  import { Svroller } from 'svrollbar';
  import BatchActionsBar from './batch-actions-bar';

</script>

<div class="workspace-content">
  <Svroller width="100%" height="100%" >
    <slot />
  </Svroller>
  <BatchActionsBar />
</div>

<style>
  .workspace-content {
    display: flex;
    flex: 1 1;
    min-height: 0;
    padding-inline: var(--layout-content-view-padding);
  }
</style>
