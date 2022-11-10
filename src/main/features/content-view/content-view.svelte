<script lang="ts">
  import { Svroller } from 'svrollbar';

</script>

<div class="workspace-content">
  <Svroller width="100%" height="100%" >
    <slot></slot>
  </Svroller>
</div>

<style>
  .workspace-content {
    display: flex;
    flex: 1 1;
    min-height: 0;
    padding-inline: 2.5rem;
  }
</style>
