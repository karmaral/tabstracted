<script lang="ts">
  import { onMount, getContext, tick } from 'svelte';
  import type { TabRenderData } from '$types/render';
  import type { MenuOption } from '$types';
  import { selectedTabs, allWindows, menuState } from '$lib/stores';
  import { closeTab, switchToTab, moveToWindow, suspendTab } from '$lib/middleware';
  import { ellipsis } from '$lib/utils';
  import { Item  } from '../.';
  import { contextKey } from '.';
  import { Checkbox } from '$features/ui'

  import { XMark } from '@steeze-ui/heroicons';
  import options from './tab-item-options';

  export let data: TabRenderData;

  $: ({ id, suspended, index } = data)
  $: title = ellipsis(data.title);
  $: src = `${data.favicon_url || ""}`;

  $: selected  = $selectedTabs.includes(id);

  $: tabStates = { selected, suspended };
  $: classes = Object.keys(tabStates).filter(c => tabStates[c]).join(' ');

  const { listHandler } = getContext(contextKey);

  let hydratedOptions: MenuOption[] = [];
  const optionCallbacks = {
    'move_to_window': (windowId: number) => handleMoveToWindow(windowId),
    'new_window': () => handleMoveToWindow(-1),
    'close': handleClose,
    'suspend': handleSuspend,
  }

  function freeListItem() {
    const item = $listHandler.getItems().filter(i => {
      const el = i.getElement();
      return parseInt(el.dataset.id) === id;
    });
    $listHandler.remove(item);
  }
  async function handleClose() {
    freeListItem();
    closeTab(data);
    if (selected) {
      selectedTabs.remove(id);
    }
    $menuState?.closeAction();
  }

  function handleSuspend() {
    suspendTab(id);
    $menuState?.closeAction();
  }

  function handleSwitchTo() {
    const item = document.querySelector(`li.item[data-id="${id}"]`);
    if (item && item.classList.contains('muuri-item-releasing')) return;
    switchToTab({...data, id});
  }

  function handleSelect() {
    selectedTabs.toggle(id);
  }

  function handleMoveToWindow(windowId: number) {
    moveToWindow(id, windowId);
    $menuState?.closeAction();
    freeListItem();
  }

  function hydrateOptions() {
    const hydratedOptions = options.map((obj) => ({...obj }));
    hydratedOptions.forEach((opt, i) => {
      if (opt?.children_source === 'window') {
        console.log(`hydrating ${opt.id}... (${id})`);
        opt.children = $allWindows.map((w) => ({
          type: 'entry',
          id: w.id.toString(),
          label: w.title,
          callback: () => optionCallbacks[opt.id](w.id),
        }));
        const initial = options[i].children.map((iOpt) => {
          if (optionCallbacks[iOpt?.id]) {
            return {...iOpt, callback: () => optionCallbacks[iOpt.id]() }
          }
          return {...iOpt };
        });
        opt.children.push(...initial);
      }

      if (opt.children?.length && opt.children[0]?.type === 'separator') {
        opt.children.shift();
      }

      if (!opt.children?.length) {
        opt.callback = optionCallbacks[opt.id];
      }

      if (opt.id === 'suspend') {
        console.log(tabStates);
        if (tabStates.suspended)
          opt.disabled = true;
      }
    });
    return hydratedOptions;
  }

  const actions = [
    {
      id: 'close',
      label: 'Close',
      callback: handleClose,
      iconSource: XMark,
    }
  ];

  onMount(() => {
    hydratedOptions = hydrateOptions();
    });
</script>

<Item
  {id}
  type="tab"
  classList={['tab-item', classes]}
  options={hydratedOptions}
  {actions}
  sortable={true}
  {index}
>
  <Checkbox {selected} onSelect={handleSelect} draggable={true} />
  <img class="tab-icon" {src} alt="">
  <span style="font-family: monospace; opacity: .8; font-size: 12px;">[{data.index}]</span>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="tab-title tab-switch-to ui-btn"
    on:click={handleSwitchTo}
  >
    {title}
  </div>
</Item>

<style>
  :global(li.tab-item) {
    position: relative;
    margin-block: .15em;
  }
  :global(li.tab-item.selected) {
    border-color: rgb(183 183 255);
    background: rgb(235 238 255);
  }
  :global(li.tab-item.selected:hover) {
    background: rgb(231 234 253);
  }
  :global(li.tab-item.suspended) .tab-title {
    opacity: .7;
  }
  .tab-icon {
    width: 1rem;
    height: 1rem;
    user-select: none;
  }
</style>
