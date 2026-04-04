<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { ArrowsPointingIn, ArrowsPointingOut, ChevronDown, ChevronUp } from '@steeze-ui/heroicons'
  import type { MenuOption } from '$types';
  import type { TabRenderData, GroupRenderData } from '$types/render';
  import { Item } from '$features/content-view';
  import { EditableTitle, Checkbox } from '$features/ui';
  import { batchCloseTabs, batchMoveToWindow, collapseGroup, batchUngroupTabs } from '$libF/middleware.svelte';
  import { allWindows, menuState, selectedTabs } from '$states';
  // import { getDiff, refreshList } from './tab-list-utils';

  import tabGroupOptions from './tab-group-options';
  import { TabItem, contextKey } from '.';
  import { Icon } from '@steeze-ui/svelte-icon';
  import Droppable from '$features/ui/sortable/Droppable.svelte';
  import { CollisionPriority } from '@dnd-kit/abstract';

  const fallbackTitle = 'Group (unnamed)';

  interface Props {
    data: GroupRenderData;
    childrenData: TabRenderData[];
    sortableIndex: number;
    sortableParentId?: string;
    sortableGroup?: string;
    sortableDisabled?: boolean;
    isPickedUp?: boolean;
  };
  let {
    data,
    childrenData,
    sortableIndex,
    sortableGroup = 'root',
    sortableDisabled = false,
    isPickedUp = false,
  }: Props = $props();
  
  let {
    id,
    index_span: index,
    tabs_amount,
    tab_ids,
    collapsed_browser
  } = $derived(data);
  let title = $derived(data.title || fallbackTitle);

  let collapsed_ui: boolean = $state(false);

  let selected = $derived(selectedTabs.array.some((id) => tab_ids?.includes(id)));
  let partialSelection = $derived(!tab_ids.every(id => selectedTabs.array.includes(id)));

  let listRef: HTMLUListElement = $state(document.createElement('ul'));
  let draggingInner: boolean = $state(false);

  const actions = $derived([
    {
      id: 'expand_collapse_browser',
      label: data.collapsed_browser ? 'Expand' : 'Collapse',
      callback: handleBrowserCollapse,
      iconSource: data.collapsed_browser ? ArrowsPointingOut : ArrowsPointingIn,
    },
    {
      id: 'expand_collapse',
      label: 'Expand/Collapse (UI)',
      callback: handleCollapse,
      iconSource: collapsed_ui ? ChevronDown : ChevronUp,
      iconOnly: true,
      class: 'ignore-selection-cancel',
    }
  ]);

  let options: MenuOption[] = $state([]);

  const optionCallbacks: Record<string, (...args: any[]) => unknown> = {
    'close_all': handleCloseAll,
    'ungroup': handleUngroup,
    'move_to_window': (windowId: number) => handleMoveToWindow(windowId),
    'rename': () => {},
  };

  function syncOptions() {
    const syncedOptions = tabGroupOptions.map((obj) => ({...obj}));
    syncedOptions.forEach((opt, i) => {
      const optId = opt.id as string;
      const optionCallback = optionCallbacks.hasOwnProperty(optId) ? optionCallbacks[optId] : undefined;
      if (opt.children_source === 'window') {
        opt.children = allWindows.value.map((w) => {
          const result: MenuOption = {
            type: 'entry',
            id: w.id.toString(),
            label: w.title,
            callback: () => optionCallback?.(w.id), 
          };
          return result;
        }).filter(ch => parseInt(ch.id!) !== data.window_id);

        if (tabGroupOptions[i].children) {
          const initial: MenuOption[] = tabGroupOptions[i].children.map((initialOpt) => {
            const initialOptId = initialOpt.id as string;
            const optionCallback = optionCallbacks.hasOwnProperty(initialOptId) ? optionCallbacks[initialOptId] : undefined;
            if (optionCallback) {
              return { 
                ...initialOpt,
                callback: () => optionCallback(),
              };
            }
            return { ...initialOpt };
          });

          opt.children.push(...initial);
        }
      }

      if (!opt.children?.length && optionCallback) {
        opt.callback = optionCallback;
      }
    });
    return syncedOptions;
  }

  function handleCollapse() {
    // Can't mutate props, but how do I update it?
    // data.collapsed_ui = !data.collapsed_ui;
    collapsed_ui = !collapsed_ui;
  }

  function handleBrowserCollapse() {
    collapseGroup(id, !data.collapsed_browser);
  }

  function handleCloseAll() {
    batchCloseTabs(tab_ids);
  }

  async function handleUngroup() {
    await batchUngroupTabs(tab_ids)
    menuState.closeAction();
  }

  async function handleMoveToWindow(windowId: number) {
    await batchMoveToWindow(tab_ids, windowId);
    menuState.closeAction();
  }

  function handleSelect() {
    if (partialSelection) {
      selectedTabs.add(tab_ids);
      return;
    }
    selectedTabs.remove(tab_ids);
  }


  function updateRenderList() {
    // const refreshOpts = {
    //   listHandler: $listHandler,
    //   renderList: childrenData,
    //   listElem: ref,
    //   diffOptions: { nested: true, indexOffset: index[0] },
    // };
    // requestAnimationFrame(() => refreshList(refreshOpts));
    // renderList = childrenData;
  }

  $effect(() => {
    if (childrenData) {
      updateRenderList();
    }
  });

  $effect(() => {
    if (allWindows.value) {
      options = syncOptions();
    }
  });

  onMount(() => {
    options = syncOptions();
  });
</script>

<Item
  {id}
  type="group"
  sortableAccepts={['tab']}
  {sortableIndex}
  {sortableDisabled}
  {sortableGroup}
  {isPickedUp}
  classList={[
    'tab-group',
    { 
      'dragging-inner' : draggingInner,
      'picked-up': isPickedUp,
      'collapsed': collapsed_ui,
    },
  ]}
  {options}
  {actions}
  optionsButtonOrder="last"
  layout="group"
  cssVars={{ color: data.color }}
>
  {#snippet header()}
    {@const tabsAmountLabel = `${tabs_amount} tab${tabs_amount > 1 ? 's' : ''}` }
    <div class="header-content">
      <Checkbox {selected} {partialSelection} onSelect={handleSelect} />
      <span style="font-family: monospace; opacity: .8; font-size: 12px;">{JSON.stringify(data.index_span)}</span>
      <EditableTitle {title}
        classList={['tab-group-title']}
        renameAction={console.log}
      />
      <span class="tab-group-amount">{tabsAmountLabel}</span>
      <div class="tab-group-collapsed">
        {data.collapsed_browser ? 'Collapsed' : ''}
      </div>
    </div>
    <button class="btn ui-toggle" onclick={handleCollapse}>
      <Icon src={ChevronUp} size="1rem"/>
    </button>
  {/snippet}

  {#snippet children()}
    {@const id = `group-${data.id}`}
    <div class="inner-container">
      <Droppable
        {id}
        tag="ul"
        accept="tab"
        class="sortable-list"
        collisionPriority={CollisionPriority.High}
      >
        <!-- TODO: Somehow make the droppable dormant until a threshold of 'over', 
        so that quick toplevel sorts aren't sucked in by this -->
        {#each childrenData as child, childIndex (child.id)}
          <TabItem 
            data={child} 
            sortableIndex={childIndex}
            sortableGroup={id}
          />
        {/each}
      </Droppable>
    </div>
  {/snippet}
</Item>

<style>
  :global(.item.tab-group) {
    display: flex;
    flex-direction: column;
    gap: .5em;
    background-color: hsl(0, 0%, 95%);
    border-left: 2px solid;
    border-left-color: var(--color, initial) !important;
  }
  :global(.item.tab-group.collapsed .slot.main) {
    height: 0;
    overflow: hidden;
  }
  :global(li.tab-group .select-box) {
    visibility: hidden;
  }
  :global(.tab-group:not(:where(.placeholder, .busy, .picked-up)):hover .select-box), 
  :global(.tab-group:not(:where(.placeholder, .busy, .picked-up)).selected .select-box) {
    visibility: visible;
  }
  :global(.tab-group .slot.header) {
    flex-wrap: wrap;
  }
  .ui-toggle {
    order: 1;
    flex-basis: 100%;
    padding-block: .25em;
  }
  .header-content {
    display: contents;
  }
  .header-content > * {
    line-height: 1.5;
  }
  .tab-group-amount, .tab-group-collapsed {
    opacity: .7;
  }
  .inner-container {
    width: 100%;
  }
</style>
