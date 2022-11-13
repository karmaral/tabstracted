<script lang="ts">
  import type { TabRenderData } from '$types/render';
  import { selectedTabs } from '$lib/stores';
  import { closeTab, switchToTab } from '$lib/middleware';
  import { ContentItem } from '../.';
  import { Check, XMark } from '@steeze-ui/heroicons';
  import options from './tab-item-options';
  import { Icon } from '@steeze-ui/svelte-icon';

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
  }

  function handleSwitchTo() {
    switchToTab(data);
  }

  function handleSelect() {
    selected
      ? selectedTabs.update(prev => prev.filter(i => i !== id))
      : selectedTabs.update(prev => [...prev, id])
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
  <div class="select-box">
    {#if selected}
      <Icon src={Check} size={'1rem'} stroke-width={2} />
    {/if}
    <div class="pointer-target" on:click={handleSelect}></div>
  </div>
  <img class="tab-icon" {src} alt="">
  <div class="tab-title tab-switch-to ui-btn" on:click={handleSwitchTo}>
    {title}
  </div>
</ContentItem>

<style>
  :global(li.tab-entry) {
    position: relative;
  }
  :global(li.tab-entry.selected, li.tab-entry.selected:hover) {
    border-color: rgb(183 183 255);
    background: rgb(235 238 255);
  }
  .tab-icon {
    width: 1em;
    height: 1em;
    user-select: none;
  }
	.select-box {
		width: 1rem;
		height: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgb(0 0 0 / 33%);
	}
	.select-box .pointer-target {
		cursor: pointer;
		width: calc(1rem + 2px);
		position: absolute;
    top: 0;
    bottom: 0;
	}
</style>
