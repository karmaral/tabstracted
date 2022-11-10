<script lang="ts">
  import type { GroupRenderData, TabRenderData } from '$types/render';
  import { ContentList } from '../.';
  import { TabItem, TabGroup } from '.';

  export let tabs: TabRenderData[];
  export let groups: GroupRenderData[];
  $: ungroupedTabs = tabs.filter(t => t.group_id === -1);
</script>

<ContentList>
  {#each groups as data}
    <TabGroup {data}>
      {#each tabs.filter(t => t.group_id === data.id) as data}
        <TabItem {data} />
      {/each}
    </TabGroup>
  {/each}

  {#each ungroupedTabs as data}
    <TabItem {data} />
  {/each}
</ContentList>

<style>
</style>
