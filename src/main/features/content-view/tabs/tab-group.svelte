<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { ArrowsPointingIn } from '@steeze-ui/heroicons'
  import Muuri from 'muuri';
  import type { MenuOption } from '$types';
  import type { TabRenderData, GroupRenderData } from '$types/render';
  import { Item, ContentList } from '$features/content-view';
  import { EditableTitle, Checkbox, SortableList } from '$features/ui';
  import { batchCloseTabs, batchMoveToWindow, collapseGroup, batchUngroupTabs } from '$lib/middleware';
  import { allWindows, menuState, selectedTabs } from '$lib/stores';
  import { getDiff, refreshList } from './tab-list-utils';

  import options from './tab-group-options';
  import { TabItem, contextKey } from '.';

  export let data: GroupRenderData;
  export let childrenData: TabRenderData[];
  $: ({ id, index, title, tabs_amount, tab_ids, collapsed_browser } = data);
  $: selected = $selectedTabs.some((id) => tab_ids?.includes(id));

  let listElem: HTMLUListElement;
  let listHandler = writable<Muuri>();
  let hydratedOptions: MenuOption[] = [];

  const ctx: { listHandler: Muuri; refreshMainList: () => void; } = getContext(contextKey);
  const optionCallbacks = {
    'close_all': handleCloseAll,
    'ungroup': handleUngroup,
    'move_to_window': (windowId: number) => handleMoveToWindow(windowId),
    'rename': () => {},
  }

  function handleCollapse() {
    collapseGroup(id, !data.collapsed_browser);
  }

  function handleCloseAll() {
    batchCloseTabs(tab_ids);
  }

  async function handleUngroup() {
    await batchUngroupTabs(tab_ids)
    $menuState.closeAction();
  }

  async function handleMoveToWindow(windowId: number) {
    await batchMoveToWindow(tab_ids, windowId);
    $menuState.closeAction();
  }

  function handleSelect() {
    selectedTabs.toggle(tab_ids);
  }

  function hydrateOptions() {
    const hydratedOptions = options.map((obj) => ({...obj}));
    hydratedOptions.forEach((opt, i) => {
      if (opt?.children_source === 'window') {
        opt.children = $allWindows.map((w) => ({
          type: 'entry',
          id: w.id.toString(),
          label: w.title,
          callback: () => optionCallbacks[opt.id](w.id),
        }));
        const initial = options[i].children.map((iOpt) => {
          if (optionCallbacks[iOpt?.id]) {
            return { ...iOpt, callback: () => optionCallbacks[iOpt.id]() };
          }
          return { ...iOpt };
        });
        opt.children.push(...initial);
      }

      if (opt.children?.length && opt.children[0].type === 'separator') {
        opt.children.shift();
      }

      if (!opt.children?.length) {
        opt.callback = optionCallbacks[opt.id];
      }
    });
    return hydratedOptions;
  }

  const actions = [
    {
      id: 'expand_collapse',
      label: 'Expand/Collapse',
      callback: handleCollapse,
      // iconSource: ArrowsPointingIn,
    }
  ];

  function updateRenderList() {
    const refreshOpts = {
      listHandler: $listHandler,
      renderList: childrenData,
      listElem,
      diffOptions: { nested: true, indexOffset: index[0] },
    };
    requestAnimationFrame(() => refreshList(refreshOpts));
  }
  $: if (childrenData) { updateRenderList(); }
  onMount(() => {
    hydratedOptions = hydrateOptions();
    let initialized = false;
    $listHandler = new Muuri(listElem, {
      items: '.item',
      dragEnabled: true,
      sortData: {
        index: (_item, elem) => {
          return parseInt(elem.dataset.index);
        },
      },
    });

    $listHandler
    .on('layoutStart', () => {
      if (!initialized) {
        ctx.refreshMainList();
        initialized = true;
      }
    })
  });
</script>

<Item
  {id}
  type="group"
  classList={['tab-group']}
  options={hydratedOptions}
  {actions}
  cssVars={{ color: data.color }}
  optionsButtonOrder="last"
  layout="group"
  sortable={true}
  index={index[0]}
>
  <div slot="header">
    <Checkbox {selected} onSelect={handleSelect} />
    <span style="font-family: monospace; opacity: .8; font-size: 12px;">{JSON.stringify(data.index)}</span>
    <EditableTitle {title}
      classList={['tab-group-title']}
      renameAction={console.log}
    />
    <span class="tab-group-amount">{tabs_amount} tabs</span>
    <div class="tab-group-collapsed">
      {data.collapsed_browser ? 'Collapsed' : ''}
    </div>
  </div>

  <ul class="content-list"
    bind:this={listElem}
  >
    {#each childrenData as data (data.id)}
      <TabItem {data} />
    {/each}
  </ul>
</Item>

<style>
  .content-list {
    position: relative;
    display: flex;
    padding-inline: 0;
    width: 100%;
  }
  :global(li.item.tab-group) {
    margin-block: .5rem;
    display: flex;
    flex-direction: column;
    gap: .5em;
    background-color: hsl(0, 0%, 95%);
    border-left: 2px solid var(--color);
  }
  :global(li.item.tab-group > .item-content) {
    padding: .5em;
  }
  [slot] {
    display: contents;
  }
  [slot="header"] > * {
    line-height: 1.5;
  }
  .tab-group-amount, .tab-group-collapsed {
    opacity: .7;
  }
</style>
