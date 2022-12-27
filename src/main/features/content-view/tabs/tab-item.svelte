<script lang="ts">
  import { onMount } from 'svelte';
  import type { TabRenderData } from '$types/render';
  import type { MenuOption } from '$types';
  import { selectedTabs, allWindows, menuState } from '$lib/stores';
  import { closeTab, switchToTab, moveToWindow } from '$lib/middleware';
  import { ContentItem } from '../.';
  import { Checkbox } from '$features/ui'

  import { XMark } from '@steeze-ui/heroicons';
  import options from './tab-item-options';

  export let data: TabRenderData;

  $: ({ id } = data)
  $: idStr = `tab_${id}`;
  $: title = data.title.length < 120
    ? data.title
    : `${data.title.substring(0, 120)}...`;
  $: src = `${data.favicon_url || ""}`;

  $: selected  = $selectedTabs.includes(id);

  let hydratedOptions: MenuOption[] = [];

  const optionCallbacks = {
    'close': handleClose,
    'move_to_window': (windowId: number) => handleMoveToWindow(windowId),
    'new_window': () => handleMoveToWindow(-1),
  }

  function handleClose() {
    closeTab(data);
    if (selected) {
      selectedTabs.remove(id);
    }
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
  id={idStr}
  className="tab-entry {selected ? 'selected' : ''}"
  options={hydratedOptions}
  {actions}
>
  <Checkbox {selected} onSelect={handleSelect} draggable={true} />
  <img class="tab-icon" {src} alt="">
  <div class="tab-title tab-switch-to ui-btn"
    on:click={handleSwitchTo}
  >
    {title}
  </div>
</ContentItem>

<style>
  :global(li.tab-entry) {
    position: relative;
  }
  :global(li.tab-entry.selected) {
    border-color: rgb(183 183 255);
    background: rgb(235 238 255);
  }
  :global(li.tab-entry.selected:hover) {
    background: rgb(231 234 253);
  }
  .tab-icon {
    width: 1em;
    height: 1em;
    user-select: none;
  }
</style>
