<script lang="ts">
  import { onMount } from 'svelte';
  import type { TabRenderData } from '$types/render';
  import type { MenuOption } from '$types';
  import { selectedTabs, allWindows, menuState } from '$lib/stores';
  import { closeTab, switchToTab, moveToWindow, suspendTab } from '$lib/middleware';
  import { ellipsis } from '$lib/utils';
  import { ContentItem } from '../.';
  import { Checkbox } from '$features/ui'

  import { XMark } from '@steeze-ui/heroicons';
  import options from './tab-item-options';

  export let data: TabRenderData;

  $: ({ id, suspended } = data)
  $: title = ellipsis(data.title);
  $: src = `${data.favicon_url || ""}`;

  $: selected  = $selectedTabs.includes(id);

  $: tabStates = { selected, suspended };
  $: classes = Object.keys(tabStates).filter(c => tabStates[c]).join(' ');

  let hydratedOptions: MenuOption[] = [];

  const optionCallbacks = {
    'move_to_window': (windowId: number) => handleMoveToWindow(windowId),
    'new_window': () => handleMoveToWindow(-1),
    'close': handleClose,
    'suspend': handleSuspend,
  }

  function handleClose() {
    closeTab(data);
    if (selected) {
      selectedTabs.remove(id);
    }
    $menuState.closeAction();
  }

  function handleSuspend() {
    suspendTab(id);
    $menuState.closeAction();
  }

  function handleSwitchTo() {
    switchToTab(data);
  }

  function handleSelect() {
    selectedTabs.toggle(id);
  }

  function handleMoveToWindow(windowId: number) {
    moveToWindow(id, windowId);
    $menuState.closeAction();
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

<ContentItem
  {id}
  type="tab"
  classList={['tab-item', classes]}
  options={hydratedOptions}
  {actions}
  sortable={true}
>
  <Checkbox {selected} onSelect={handleSelect} draggable={true} />
  <img class="tab-icon" {src} alt="">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="tab-title tab-switch-to ui-btn"
    on:click={handleSwitchTo}
  >
    {title}
  </div>
</ContentItem>

<style>
  :global(li.tab-item) {
    position: relative;
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
