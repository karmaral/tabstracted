<script lang="ts">
  import { onMount, getContext, tick } from 'svelte';
  import type { TabRenderData } from '$types/render';
  import type { MenuOption } from '$types';
  import { selectedTabs, allWindows, menuState } from '$states';
  import { closeTab, switchToTab, moveToWindow, suspendTab } from '$libF/middleware.svelte';
  import { ellipsis } from '$libF/utils';
  import { Item } from '$features/content-view';
  import { renderListState } from './states.svelte';
  // import { dropAnimation } from '$features/ui/sortable';
  import { Checkbox } from '$features/ui'

  import { XMark } from '@steeze-ui/heroicons';
  import tabItemOptions from './tab-item-options';

  const fallbackSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#aeaeae" >
    <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 1-11-4.69v.447a3.5 3.5 0 0 0 1.025 2.475L8.293 10 8 10.293a1 1 0 0 0 0 1.414l1.06 1.06a1.5 1.5 0 0 1 .44 1.061v.363a1 1 0 0 0 .553.894l.276.139a1 1 0 0 0 1.342-.448l1.454-2.908a1.5 1.5 0 0 0-.281-1.731l-.772-.772a1 1 0 0 0-1.023-.242l-.384.128a.5.5 0 0 1-.606-.25l-.296-.592a.481.481 0 0 1 .646-.646l.262.131a1 1 0 0 0 .447.106h.188a1 1 0 0 0 .949-1.316l-.068-.204a.5.5 0 0 1 .149-.538l1.44-1.234A6.492 6.492 0 0 1 16.5 10Z" clip-rule="evenodd" />
  </svg>
  `;
  const fallbackSrcSVG = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;


  interface Props {
    data: TabRenderData;
    sortableIndex: number;
    sortableGroup?: string;
    sortableDisabled?: boolean;
    isPickedUp?: boolean;
  };
  let {
    data,
    sortableIndex,
    sortableGroup = 'root',
    sortableDisabled = false,
    isPickedUp = false,
  }: Props = $props();

  let id = $derived(data.id);
  let suspended = $derived(data.suspended);
  let index = $derived(data.index);
  let title = $derived(data.title);
  let src = $derived(`${data.favicon_url || ''}`);

  let selected =  $derived(selectedTabs.array.includes(id));
  let tabStates: Record<string, boolean> = $derived({ selected, suspended });

  let classes = $derived.by(() => {
    const keys = Object.keys(tabStates);
    return keys.filter((cl: string) => tabStates[cl]).join(' ');
  });

  let options: MenuOption[] = $state([]);

  const isRoot = $derived(data.group_id === -1);
  const accept: [string, ...string[]] = $derived.by(() => {
    if (isRoot) {
      return ['tab', 'group'];
    }
    return ['tab'];

  });


  const actions = [
    {
      id: 'close',
      label: 'Close',
      callback: handleClose,
      iconSource: XMark,
    }
  ];


  const optionCallbacks: Record<string, (...args: any[]) => unknown> = {
    'move_to_window': (windowId: number) => handleMoveToWindow(windowId),
    'new_window': () => handleMoveToWindow(-1),
    'close': handleClose,
    'suspend': handleSuspend,
  };

  function syncOptions() {
    const syncedOptions = tabItemOptions.map((obj) => ({...obj }));

    syncedOptions.forEach((opt, i) => {
      const optId = opt.id as string;
      if (opt.children_source === 'window') {
        opt.children = allWindows.value.map((w) => {
          const optionCallback = optionCallbacks.hasOwnProperty(optId) ? optionCallbacks[optId] : undefined;
          const result: MenuOption = {
            type: 'entry',
            id: w.id.toString(),
            label: w.title,
            callback: () => optionCallback?.(w.id),
          };
          return result;
        }).filter(ch => parseInt(ch.id!) !== data.window_id);

        
        if (tabItemOptions[i].children) {
          const initial: MenuOption[] = tabItemOptions[i].children.map((initialOpt) => {
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

      if (!opt.children?.length) {
        const optionCallback = optionCallbacks.hasOwnProperty(optId) ? optionCallbacks[optId] : undefined;
        if (optionCallback) {
          opt.callback = optionCallback;
        }
      }

      if (opt.id === 'suspend') {
        if (tabStates.suspended)
          opt.disabled = true;
      }
    });
    return syncedOptions;
  }

  async function handleClose() {
    // TODO: Add pause render sync + interface with sortable

    renderListState.pauseDataSync = true;

    // update visually
    const index = renderListState.root.findIndex(item => item.id === id);
    renderListState.root.splice(index, 1);

    closeTab(data);

    if (selected) {
      selectedTabs.remove(id);
    }
    menuState?.closeAction();

    // wait for animation before resync
    // await sleep(dropAnimation.duration!);
    renderListState.pauseDataSync = false;
  }

  function handleSuspend() {
    suspendTab(id);
    menuState?.closeAction();
  }

  function handleSwitchTo(ev: MouseEvent) {
    // const item = document.querySelector(`li.item[data-id="${id}"]`);
    // if (item && item.classList.contains('muuri-item-releasing')) return;
    switchToTab({...data, id});
    ev.stopPropagation();
  }

  function handleSelect() {
    selectedTabs.toggle(id);
  }

  function handleAuxClick(ev: MouseEvent) {
    if (ev.button !== 1) return;
    handleClose();
  }

  function handleMoveToWindow(windowId: number) {
    moveToWindow(id, windowId);
    menuState?.closeAction();
  }


  $effect(() => {
    if (menuState.open) {
      options = syncOptions();
    }
  });

  onMount(() => {
    options = syncOptions();
  });
</script>

<Item
  {id}
  {sortableIndex}
  type="tab"
  sortableAccepts={accept}
  {sortableDisabled}
  {sortableGroup}
  {isPickedUp}
  classList={['tab-item', classes]}
  {options}
  {actions}
  onClick={handleSelect}
  onAuxClick={handleAuxClick}
>
  <Checkbox {selected} onSelect={handleSelect} draggable={true} />
  <img class="tab-icon" src={src || fallbackSrcSVG} alt="">
  <span style="font-family: monospace; opacity: .8; font-size: 12px;">[{data.index}]</span>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div 
    class="tab-title tab-switch-to ui-btn"
    onclick={handleSwitchTo}
    role="button"
    tabindex="0"
  >
    {title}
  </div>
</Item>
