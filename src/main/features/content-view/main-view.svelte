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
      <div class="scroll-padding">
        <div class="tab-view">
            <TabList {tabs} {groups}/>
        </div>
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
    padding-left: 2em;
    position: relative;
  }
  .scroll-padding {
    padding-bottom: 3rem;
  }
</style>
