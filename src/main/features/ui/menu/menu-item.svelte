<script lang="ts">
  import type { MenuOption, MenuOptionType } from "$types";
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ChevronRight } from '@steeze-ui/heroicons';

  export let type: MenuOptionType;
  export let label: string;
  export let children: MenuOption[] = [];
  export let callback: () => void;
  export let disabled = false;

  let active = false;

  function handleCallback() {
    callback();
    active = false;
  }
  function handleFocus() {
    active = true;
  }
  function handleBlur() {
    active = false;
  }
</script>

{#if type === 'entry'}
  <div class="menu-item ui-btn"
    class:active
    class:disabled
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:mouseover={handleFocus}
    on:mouseleave={handleBlur}
    on:click={handleCallback}
  >
    {label}
    {#if children?.length}
      <div class="has-children-icon">
        <Icon src={ChevronRight} size={'1em'} />
      </div>
      <div class="menu-container sub-menu">
        {#each children as ch}
          <svelte:self
            type={ch.type}
            label={ch.label}
            callback={ch.callback}
          />
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div class="menu-item-separator"></div>
{/if}

<style>
  .menu-container.sub-menu {
    left: 100%;
    display: none;
    width: max-content;
  }
  .menu-item-separator {
    border-bottom: 1px solid gainsboro;
    margin: .3rem;
  }
  .menu-item {
    display: flex;
    align-items: center;
    padding: .5rem;
    position: relative;
  }
  .menu-item.active {
    background-color: rgb(0 0 0 / 5%);
  }
  .menu-item.disabled {
    opacity: .5;
    pointer-events: none;
  }
  .has-children-icon {
    margin-left: auto;
  }
</style>
