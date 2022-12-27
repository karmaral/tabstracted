<script lang="ts">
  import type { TabRenderData } from '$types/render';
  import { selectedTabs, allWindows, menuState } from '$lib/stores';
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

  const actions = [
    {
      label: 'Close',
      callback: handleClose,
      iconSource: XMark,
    }
  ];

</script>

<ContentItem
  id={idStr}
  className="tab-entry {selected ? 'selected' : ''}"
  {options}
  {actions}
>
  <Checkbox {selected} onSelect={handleSelect} draggable={true} />
  <img class="tab-icon" {src} alt="">
  <div class="tab-title tab-switch-to ui-btn" on:click={handleSwitchTo}>
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
