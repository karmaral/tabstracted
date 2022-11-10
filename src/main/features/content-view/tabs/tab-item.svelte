<script lang="ts">
  import type { TabRenderData } from '$types/render';
  import { closeTab, switchToTab } from '$lib/middleware';
  import { ContentItem } from '../.';
  import { Check, XMark } from '@steeze-ui/heroicons';
  import options from './tab-item-options';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let data: TabRenderData;

  $: id = `tab_${data.id}`;
  $: title = data.title.length < 120
    ? data.title
    : `${data.title.substring(0, 120)}...`;
  $: src = `${data.favicon_url || ""}`;

  let selected = false;

  function handleClose() {
    closeTab(data);
  }

  function handleSwitchTo() {
    switchToTab(data);
  }

  function handleSelect() {
    selected = !selected;
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
  {id}
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
  :global(li.tab-entry.selected) {
    border-color: blue;
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
