<script lang="ts">
  import { workspaceList } from '$states';
  import { ScrollArea } from '$features/ui';
  import { SidebarItem } from '.';

  let activeIds: string[] = $state([]);
 
</script>

<div class="workspace-list">
  <ScrollArea>
    {#each workspaceList as data}
      <SidebarItem {data} active={activeIds.includes(data.id as string)}/>
    {/each}
  </ScrollArea>
</div>

<style>
  .workspace-list {
    padding-top: 1rem;
    gap: 1rem;
    overflow-y: auto;
  }
</style>
