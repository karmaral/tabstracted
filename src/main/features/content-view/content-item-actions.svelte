<script lang="ts">
  import type { MenuOption, ActionOption } from '$types';
  import { MenuTrigger } from '$features/ui/menu';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { EllipsisVertical } from '@steeze-ui/heroicons';

  export let options: MenuOption[];
  export let optionsButtonOrder: 'first' | 'last' = 'first';
  export let actions: ActionOption[];

  let order = optionsButtonOrder === 'first' ? 0 : -1;

</script>

<div class="content-item-actions" >
  <MenuTrigger
    buttonClass="action-btn btn"
    icon={EllipsisVertical}
    iconSize={'1rem'}
    entries={options}
  />
  <div class="actions-wrapper" style:order>
    {#each actions as action}
      <button
        class="action-btn btn"
        on:click={action.callback}
    >
        <Icon src={action.iconSource} size={'1rem'} />
    </button>
    {/each}
  </div>
</div>

<style>
  .content-item-actions {
    display: flex;
    gap: var(--gap);
    margin-left: auto;
    opacity: 0;
  }
  :global(.options-open) > .content-item-actions,
  :global(.options-open.large .slot.header) > .content-item-actions {
    opacity: 1 !important;
  }
  .actions-wrapper {
    display: inherit;
    gap: inherit;
    order: 0;
  }
</style>
