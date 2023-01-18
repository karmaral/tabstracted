<script lang="ts">
  import type { GroupRenderData, TabRenderData } from '$types/render';
  import { ContentList } from '../.';
  import { TabItem, TabGroup } from '.';

  export let tabs: TabRenderData[];
  export let groups: GroupRenderData[];
  $: ungroupedTabs = tabs.filter(t => t.group_id === -1);
</script>

<ContentList>
  {#each groups as data (data.id)}
    {@const groupTabs = tabs.filter((t) => t.group_id === data.id)}
    <TabGroup {data}>
      {#each groupTabs as data (data.id)}
        <TabItem {data} />
      {/each}
    </TabGroup>
  {/each}

  {#each ungroupedTabs as data (data.id)}
    <TabItem {data} />
  {/each}
</ContentList>

<style>

</style>
