<script lang="ts">
  import { tick } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Check, EllipsisVertical, MinusSmall, Moon, XMark, SpeakerXMark  } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import type { ActionOption, MenuOption } from '$types';
  import { currentWorkspace, currentView, selectedTabs, menuState } from '$states';
  import { batchCloseTabs, batchSuspendTabs } from '$libF/middleware.svelte';
  import { sleep } from '$lib/utils';
  import { MenuTrigger } from '$features/ui/menu';

  import { tabItemOptions } from '$features/content-view/tabs';

  let options: MenuOption[] = $derived.by(() => {
    return tabItemOptions.map(opt => {
      const live = {...opt};
      live.label = `${opt.label} (${selected})`;
      return live;
    });
  });

  let selected = $derived(selectedTabs.array.length);
  let allSelected = $derived(selectedTabs.array.length === currentWorkspace.value.tabs.length);
  


  let iconSize = '1.4em';
  let ref: HTMLDivElement = $state(document.createElement('div'));

  let menuTriggerRef: HTMLButtonElement = $state(document.createElement('button'));

  const actions: ActionOption[] = [
    {
      id: 'mute',
      label: 'Mute',
      callback: handleMute,
      iconSource: SpeakerXMark,
    },
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
    if (currentView.value === 'tab') {
      const allTabs = currentWorkspace.value.tabs.map((t) => t.id);
      selectedTabs.add(allTabs);
    }
  }

  function handleClearSelection() {
    if (currentView.value === 'tab') {
      selectedTabs.clear();
    }
  }

  async function handleClose() {
    if (currentView.value === 'tab') {
      await batchCloseTabs(selectedTabs.array);
    }
      await tick();
      await sleep(100); // this avoids the de-sync of items getting deselected before being cleared
      handleClearSelection();
  }

  function handleSuspend() {
    batchSuspendTabs(selectedTabs.array);
		handleClearSelection();
  }

  function handleMute() {
    
  }

  function deselectHandler(ev: MouseEvent) {
    if (!selected) return;
    const tgt = ev.target as Element;
    if (ref?.contains(tgt as Node)) return;
    if (menuState?.element?.contains(tgt as Node)) return;

    const { classList } = tgt;

    for (const token of classList) {
      if (['pointer-target','ignore-selection-cancel'].includes(token)) {
        return;
      }
    }

    // TODO: don't clear if clicking anywhere and menu is currently open
    handleClearSelection();
  }
  document.addEventListener('click', deselectHandler);

  function handleContextMenu(ev: MouseEvent) {
    if (!menuTriggerRef) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    menuTriggerRef.click();
  }

</script>

<div 
  class="batch-actions-bar"
  class:visible={selected}
  role="button"
  tabindex="0"
  oncontextmenu={handleContextMenu}
  bind:this={ref}
>
  <div class="selection-count">
    <button
      class="action-btn select-box"
      class:all={allSelected}
      onclick={handleSelectAll}
    >
      <Icon
        src={allSelected ? Check : MinusSmall}
        size="1em"
        stroke-width={3}
      />
      <Icon
        src={allSelected ? XMark : Check}
        size="1em"
        stroke-width={3}
        class="hover"
      />
    </button>
    <span>{selected} selected</span>
  </div>
  <div class="actions">
    {#each actions as action}
      <button class="action-btn"
        onclick={() => action.callback}
      >
        <Icon src={action.iconSource} size={iconSize} />
      </button>
    {/each}
    <MenuTrigger
      buttonClass="action-btn"
      icon={EllipsisVertical}
      {iconSize}
      entries={options}
      bind:ref={menuTriggerRef}
    />
  </div>
</div>

<style lang="scss">
  .batch-actions-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .6rem;
    box-shadow: 0 -0.1em 1em rgb(0 0 0 / 15%);
    background: var(--theme-color-main-bg);
    border: 1px solid gainsboro;
    min-width: var(--layout-min-item-width);
    /* width: calc(100% - var(--layout-content-view-padding) * 2 - var(--layout-main-view-gap)); */
    width: 100%;
    max-width: var(--layout-max-item-width);
    font-size: .9rem;
    user-select: none;
    position: relative;
    z-index: 8;
    visibility: hidden;

    &.visible {
      visibility: visible;
    }
    & :global(.action-btn) {
      all: unset;
      cursor: pointer;
      user-select: none;
      font-size: inherit;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .3em;

      &:hover {
        background-color: rgb(0 0 0 / 5%);
      }
     }
  }

  .selection-count {
    position: relative;
    display: flex;
    align-items: center;

    span {
      padding-inline: .5em;
    }
  }

  /* This is smelly, should probably
    Refactor into multiple-case SelectBox component
    This would be useful for the TabGroup as well
  */
  .batch-actions-bar .select-box {
    border: 1px solid rgb(0 0 0 / 33%);

    :global(svg.hover) {
      display: none;
    }

    &:hover :global(svg.hover) {
      display: block;
    }

    &:hover :global(svg:first-of-type) {
      display: none;
    }
  }

  .actions {
    display: flex;
  }

</style>
