<script lang="ts">
  import { storageLoaded, currentWorkspace } from '$lib/stores';
  import { ContentHeader, ContentView } from '.';
  import { LoadingWidget } from '$features/ui';
  import TabList from './tabs';

  $: tabs = $currentWorkspace.tabs;
  $: groups = $currentWorkspace.groups;
</script>

<main>
  {#if !$storageLoaded}
    <LoadingWidget fontSize={'2em'} />
  {:else}
    <ContentHeader />
    <ContentView>
      <div class="tab-view">
          <TabList {tabs} {groups}/>
      </div>
    </ContentView>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    padding-left: 2rem;
    position: relative;
  }
</style>
