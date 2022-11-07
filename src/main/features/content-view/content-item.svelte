<script lang="ts">
  import type { MenuOption, ActionOption } from '$types';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { EllipsisVertical } from '@steeze-ui/heroicons';

  export let id: string;
  export let className: string;
  export let options: MenuOption[];
  export let actions: ActionOption[];

</script>

<li {id} class="content-item {className}">
  <div class="main-slot">
    <slot></slot>
  </div>

  <div class="content-item-actions">
    <button
      class="action-btn btn"
      on:click={() => console.log(options)}
    >
      <Icon src={EllipsisVertical} size={'1rem'} />
    </button>
    {#each actions as action}
      <button
        class="action-btn ui-btn"
        on:click={action.callback}
      >
        <Icon src={action.iconSource} size={'1rem'} />
      </button>
    {/each}
  </div>
</li>

<style>
  .content-item {
    --gap: 1em;
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: .5em 1em;
    border: 1px solid rgb(0 0 0 / 33%);
    background-color: var(--theme-main-bg);
  }
  .content-item:hover {
    background-color:rgb(0 0 0 / 3%);
  }
  .main-slot {
    display: flex;
    gap: var(--gap);
    align-items: center;
  }
  .content-item-actions {
    display: flex;
    gap: var(--gap);
    margin-left: auto;
    opacity: 0;
  }
  .content-item:hover .content-item-actions { opacity: 1; }

  .action-btn {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .2em;
  }
  .action-btn:hover {
    background-color: rgb(0 0 0 / 5%);
  }
</style>
