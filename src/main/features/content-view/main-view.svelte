<script lang="ts">
  import { storageLoaded, currentWorkspace } from '$lib/stores';
  import { Header, ContentFrame } from '.';
  import { LoadingWidget } from '$features/ui';
  import TabList from './tabs';

  $: ({ tabs, groups } = $currentWorkspace);
</script>

<main>
  {#if $storageLoaded && $currentWorkspace}
    <Header />
    <ContentFrame>
      <div class="scroll-padding">
        <div class="tab-view">
          <TabList {tabs} {groups} />
        </div>
      </div>
    </ContentFrame>
  {:else}
    <LoadingWidget fontSize={'2em'} />
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    padding-left: var(--layout-main-view-gap);
    position: relative;
  }
  .scroll-padding {
    padding-bottom: calc(var(--layout-action-bar-height) + 1rem);
  }
</style>
