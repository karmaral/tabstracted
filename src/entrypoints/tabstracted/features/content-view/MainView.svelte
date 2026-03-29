<script lang="ts">
  import { storageLoaded, currentWorkspace, selectedTabs, debugDnDState } from '$states';
  import { undoLastAction } from '$libF/middleware.svelte';
  import { Header, ContentFrame } from '$features/content-view';
  import { LoadingWidget } from '$features/ui';
  import TabList from './tabs';
  import BatchActionsBar from './batch-action-bar';

  const tabs = $derived(currentWorkspace.value.tabs);
  const groups = $derived(currentWorkspace.value.groups);

  async function createTestData() {
    const tab = await browser.tabs.create({ 
      url: 'https://reddit.com',
      selected: false,
    });
    console.log({tab });
    const groupId = await browser.tabs.group({
      tabIds: [tab.id as number],
    });
    await browser.tabGroups.update(groupId, { color: 'red' });
  }

  function handleKeys(ev: KeyboardEvent) {
    const { key, ctrlKey } = ev;

    if (key === 'z' && ctrlKey) {
      undoLastAction();
      return;
    }
  }
  
  onMount(() => {
    document.addEventListener('keydown', handleKeys);

  });

</script>

<main>
  {#if storageLoaded.value && currentWorkspace.value}
    <Header />
    <div>
      <button onclick={createTestData}>Test</button>
      <span>active: {debugDnDState.active} | over: {debugDnDState.over}</span>
    </div>
    <ContentFrame>
      <div class="scroll-padding">
        <div class="tab-view">
          <BatchActionsBar />
          <TabList {tabs} {groups} />
        </div>
      </div>
    </ContentFrame>
  {:else}
    <LoadingWidget fontSize="2em" />
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
