<script lang="ts">
  import { workspaceList } from '$states';
  import { Svroller } from 'svrollbar';
  import { SidebarItem } from '.';

  let activeIds: string[] = $state([]);
 
</script>

<div class="workspace-list">
  <Svroller width="100%" height="100%">
    {#each workspaceList as data}
      <SidebarItem {data} active={activeIds.includes(data.id as string)}/>
    {/each}
  </Svroller>
</div>

<style>
  .workspace-list {
    padding-top: 1rem;
    gap: 1rem;
    overflow-y: auto;
  }
</style>
