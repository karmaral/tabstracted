<script lang="ts">
  import type { TabRenderData } from '$types/render';
  import { closeTab, switchToTab } from '$lib/middleware';
  import { ContentItem } from '../.';
  import { XMark } from '@steeze-ui/heroicons';
  import options from './tab-item-options';

  export let data: TabRenderData;

  $: id = `tab_${data.id}`;
  $: title = data.title.length < 120
    ? data.title
    : `${data.title.substring(0, 120)}...`;
  $: src = `${data.favicon_url || ""}`;

  function handleClose() {
    closeTab(data);
  }

  function handleSwitchTo() {
    switchToTab(data);
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
  className={'tab-entry'}
  {options}
  {actions}
>
  <img class="tab-icon" {src} alt="">
  <div class="tab-title tab-switch-to ui-btn" on:click={handleSwitchTo}>
    {title}
  </div>
</ContentItem>

<style>
  .tab-icon {
    width: 1em;
    height: 1em;
    user-select: none;
  }
</style>
