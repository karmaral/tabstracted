<script lang="ts">
  import { ArrowsPointingIn } from '@steeze-ui/heroicons'
  import { ContentItem, ContentList } from '$features/content-view';
  import { EditableTitle } from '$features/ui';
  import { collapseGroup } from '$lib/middleware';
  import options from './tab-group-options';


  export let data;

  $: ({ title, tabs_amount } = data);

  function handleCollapse() {
    collapseGroup(data.id, !data.collapsed_browser);
  }

  const actions = [
    {
      id: 'expand_collapse',
      label: 'Expand/Collapse',
      callback: handleCollapse,
      iconSource: ArrowsPointingIn,
    }
  ];
  console.log('tabgroup')
</script>

<ContentItem
  className="tab-group"
  {options}
  {actions}
  --color={data.color}
  inlineLayout={false}
  optionsButtonOrder={'last'}
>
  <div slot="header">
    <span class="tab-group-title">
      <EditableTitle {title} renameAction={console.log} />
    </span>
    <span class="tab-group-amount">{tabs_amount} tabs</span>
    <div class="tab-group-collapsed">
      {data.collapsed_browser ? 'Collapsed' : ''}
    </div>
  </div>

  <ContentList width={'100%'}>
    <slot></slot>
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
