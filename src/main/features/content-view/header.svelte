<script lang="ts">
  import {
    currentWorkspace,
    selectedTabs,
    currentView,
  } from '$lib/stores';
  import EditableTitle from '$features/ui/editable-title.svelte';
  import { batchCloseTabs } from '$lib/middleware';

  $: title = $currentWorkspace.title;
  function handleRename(newVal: string) {
    console.log('update workspace name:', newVal);
  }

  $: canBatchCloseTabs = Boolean($currentView === 'tab' && $selectedTabs.length);
  $: batchCloseTabsLabel = `Close all ${canBatchCloseTabs ? `${$selectedTabs.length} tabs` : ''}`;

	function clearTabSelection() {
		$selectedTabs = [];
	}
  async function handleBatchCloseTabs() {
		await batchCloseTabs($selectedTabs);
		clearTabSelection();
    }

</script>

<div class="content-header">
  <div class="header-row">
    <h1 class="workspace-title">
      <EditableTitle {title} renameAction={handleRename} />
    </h1>
  </div>
  <div class="header-row">
		<button class="btn action-btn"
			disabled={!canBatchCloseTabs}
			on:click={handleBatchCloseTabs}
		>
			{batchCloseTabsLabel}
		</button>
		{#if canBatchCloseTabs}
			<button class="btn action-btn"
				on:click={clearTabSelection}
			>
				Clear selection
			</button>
		{/if}
  </div>
</div>

<style>
  .content-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1em;
		padding-block-end: .5rem;
  }
  .header-row {
    display: flex;
    align-items: center;
		gap: .5rem;
  }
  .workspace-title {
    margin-block: 0;
    padding: 1em;
    line-height: 1.5;
  }
  .action-btn {
    padding: .5em;
		font-weight: 600;
  }

</style>
