<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ChevronRight } from '@steeze-ui/heroicons';
  import type { MenuOption, MenuOptionType } from "$types";

  export let type: MenuOptionType;
  export let label: string;
  export let children: MenuOption[] = [];
  export let callback: () => void;
  export let disabled = false;

  let active = false;
  let itemElement: HTMLButtonElement;
  let subMenuContainer: HTMLDivElement;
  $: hasChildren = Boolean(children?.length);

  const [popperRef, popperContent] = createPopperActions({
    placement: 'right-start',
    strategy: 'fixed',
  });

  function handleCallback() {
    callback();
    active = false;
  }

  function handleFocus() {
    if (hasChildren && !active) {
      popperRef(itemElement)
    }
    active = true;
  }

  function handleBlur() {
    active = false;
  }

</script>

{#if type === 'entry'}
  <button class="menu-item ui-btn"
    class:active
    class:disabled
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:mouseover={handleFocus}
    on:mouseleave={handleBlur}
    on:click={handleCallback}
    bind:this={itemElement}
  >
    {label}
    {#if hasChildren}
      <div class="has-children-icon">
        <Icon src={ChevronRight} size={'1em'} />
      </div>
      {#if active}
        <div class="menu-container sub-menu"
          use:popperContent
          bind:this={subMenuContainer}
        >
          {#each children as ch}
            <svelte:self
              type={ch.type}
              label={ch.label}
              callback={ch.callback}
            />
          {/each}
        </div>
      {/if}
    {/if}
  </button>
{:else}
  <div class="menu-item-separator"></div>
{/if}

<style>
  .menu-container.sub-menu {
    left: 100%;
    width: max-content;
  }
  .menu-item-separator {
    border-bottom: 1px solid gainsboro;
    margin: .3rem;
  }
  .menu-item {
    all: unset;
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
    pointer-events: none;
    margin-left: auto;
  }
</style>
