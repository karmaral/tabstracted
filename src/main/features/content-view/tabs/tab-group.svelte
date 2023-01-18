<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowsPointingIn } from '@steeze-ui/heroicons'
  import type { MenuOption } from '$types';
  import type { GroupRenderData } from '$types/render';
  import { ContentItem, ContentList } from '$features/content-view';
  import { EditableTitle, Checkbox } from '$features/ui';
  import { batchCloseTabs, batchMoveToWindow, collapseGroup } from '$lib/middleware';
  import { allWindows, menuState, selectedTabs } from '$lib/stores';
  import options from './tab-group-options';


  export let data: GroupRenderData;

  $: ({ title, tabs_amount, tab_ids } = data);
  $: selected = $selectedTabs.some((id) => tab_ids?.includes(id));

  let hydratedOptions: MenuOption[] = [];

  const optionCallbacks = {
    'close_all': handleCloseAll,
    'ungroup': handleUngroup,
    'move_to_window': (windowId: number) => handleMoveToWindow(windowId)
  }

  function handleCollapse() {
    collapseGroup(data.id, !data.collapsed_browser);
  }

  function handleCloseAll() {
    batchCloseTabs(tab_ids);
  }

  function handleUngroup() {
   // ...
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
      iconSource: ArrowsPointingIn,
    }
  ];

  onMount(() => {
    hydratedOptions = hydrateOptions();
  });
</script>

<ContentItem
  classList={['tab-group']}
  options={hydratedOptions}
  {actions}
  --color={data.color}
  inlineLayout={false}
  optionsButtonOrder={'last'}
>
  <div slot="header">
  <Checkbox {selected} onSelect={handleSelect}/>
    <EditableTitle {title}
      classList={['tab-group-title']}
      renameAction={console.log}
    />
    <span class="tab-group-amount">{tabs_amount} tabs</span>
    <div class="tab-group-collapsed">
      {data.collapsed_browser ? 'Collapsed' : ''}
    </div>
  </div>

  <ContentList width={'100%'}>
    <slot />
  </ContentList>

</ContentItem>

<style>
:global(.tab-group) {
  margin-block: .5rem;
  display: flex;
  flex-direction: column;
  gap: .5em;
  padding: .5em;
  background-color: rgb(0 0 0 / 5%);
  border-left: 2px solid var(--color);
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
