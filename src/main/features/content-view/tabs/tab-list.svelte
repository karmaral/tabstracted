<script lang="ts">
  import type { TabRenderData } from '$types/render';
  import { ContentList } from '../.';
  import { TabItem, TabGroup } from '.';

  export let tabs: TabRenderData[];
  export let groups;
</script>

<ContentList>
  {#each groups as data}
    <TabGroup {data}>
    </TabGroup>
  {/each}

  {#each tabs as data}
    <TabItem {data} />
  {/each}
</ContentList>

<style>
</style>
