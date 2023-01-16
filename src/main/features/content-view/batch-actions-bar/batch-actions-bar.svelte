<script lang="ts">
  import { tick } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Check, EllipsisVertical, MinusSmall, Moon, XMark } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import type { ActionOption, MenuOption } from '$types';
  import { currentWorkspace, currentView, selectedTabs, menuState } from '$lib/stores';
  import { batchCloseTabs, batchSuspendTabs } from '$lib/middleware';
  import { sleep } from '$lib/utils';
  import { MenuTrigger } from '$features/ui/menu';

  import tabOptions from '$features/content-view/tabs/tab-item-options';

  let options: MenuOption[] = tabOptions;

  $: selected = $selectedTabs.length;
  $: allSelected = $selectedTabs.length === $currentWorkspace.tabs.length;

  let iconSize = '1.4em';
  let elemRef: HTMLDivElement;

  const actions: ActionOption[] = [
    {
      id: 'suspend',
      label: 'Suspend',
      callback: handleSuspend,
      iconSource: Moon,
    },
    {
      id: 'close',
      label: 'Close',
      callback: handleClose,
      iconSource: XMark,
    },
  ];

  function handleSelectAll() {
    if (allSelected) {
      handleClearSelection();
      return;
    }
    if ($currentView === 'tab') {
      const allTabs = $currentWorkspace.tabs.map((t) => t.id);
      selectedTabs.add(allTabs);
    }
  }

  function handleClearSelection() {
    if ($currentView === 'tab') {
      selectedTabs.clear();
    }
  }

  async function handleClose() {
    if ($currentView === 'tab') {
      await batchCloseTabs($selectedTabs);
    }
      await tick();
      await sleep(100); // this avoids the de-sync of items getting deselected before being cleared
      handleClearSelection();
  }

  function handleSuspend() {
    batchSuspendTabs($selectedTabs);
		handleClearSelection();
  }

  function deselectHandler(e: MouseEvent) {
    if (!selected) return;
    const tgt = e.target as Element;
    if (elemRef.contains(tgt as Node)) return;
    if ($menuState?.ref.contains(tgt as Node)) return;

    if (!tgt?.classList.contains('pointer-target')) {
      handleClearSelection();
    }
  }

  document.addEventListener('click', deselectHandler);

</script>

{#if selected}
  <div class="batch-actions-bar"
    in:fly={{ y: 10 }}
    out:fly={{ y: 10 }}
    bind:this={elemRef}
  >
    <div class="selection-count">
      <button
        class="action-btn select-box"
        class:all={allSelected}
        on:click={handleSelectAll}
      >
        <Icon
          src={allSelected ? Check : MinusSmall}
          size={'1em'}
          stroke-width={3}
        />
        <Icon
          src={allSelected ? XMark : Check}
          size={'1em'}
          stroke-width={3}
          class="hover"
        />
      </button>
      <span>{selected} selected</span>
    </div>
    <div class="actions">
      {#each actions as action}
        <button class="action-btn"
          on:click={action.callback}
        >
          <Icon src={action.iconSource} size={iconSize} />
        </button>
      {/each}
      <MenuTrigger
        buttonClass="action-btn"
        icon={EllipsisVertical}
        {iconSize}
        entries={options}
      />
    </div>
  </div>
{/if}

<style>
  .batch-actions-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .6rem;
    box-shadow: 0 -0.1em 1em rgb(0 0 0 / 15%);
    background: var(--theme-main-bg);
    border: 1px solid gainsboro;
    min-width: var(--layout-min-item-width);
    width: calc(100% - var(--layout-content-view-padding) * 2 - var(--layout-main-view-gap));
    max-width: var(--layout-max-item-width);
    font-size: .9rem;
    position: absolute;
    bottom: 0;
    user-select: none;
    z-index: 5;
  }
  :global(.batch-actions-bar .action-btn) {
    all: unset;
    cursor: pointer;
    user-select: none;
    font-size: inherit;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .3em;
  }
  :global(.batch-actions-bar .action-btn:hover) {
    background-color: rgb(0 0 0 / 5%);
  }

  .selection-count {
    position: relative;
    display: flex;
    align-items: center;
  }
  .selection-count span {
    padding-inline: .5em;
  }
  .select-box {
    border: 1px solid rgb(0 0 0 / 33%);
  }
  .select-box :global(svg.hover) {
    display: none;
  }
  .select-box:hover :global(svg.hover) {
    display: block;
  }
  .select-box:hover :global(svg:first-of-type) {
    display: none;
  }

  .actions {
    display: flex;
  }


</style>
