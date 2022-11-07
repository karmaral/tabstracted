<script>
  import { workspaceList } from '$lib/stores';
  import { SidebarItem } from '.';
  let activeIds = [];

  $: console.log($workspaceList);

</script>

<div class="workspace-list">
  {#each $workspaceList as data}
    <SidebarItem {data} active={activeIds.includes(data.id)}/>
  {/each}
</div>

<style>
  .workspace-list {
    padding-top: 1rem;
    gap: 1rem;
    overflow-y: auto;
  }
</style>
