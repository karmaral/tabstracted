<script lang="ts">
  import Self from './MenuItem.svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ChevronRight } from '@steeze-ui/heroicons';
  import type { MenuOption, MenuOptionType } from '$types';
  import { menuState } from '$states';

  interface Props {
    type: MenuOptionType;
    label: string;
    children?: MenuOption[];
    callback?: MenuOption['callback'];
    disabled?: boolean;
  };
  let {
    type,
    label,
    children = [],
    callback = () => void 0,
    disabled = false,
  }: Props = $props();

  let active: boolean = $state(false);
  let itemRef: HTMLButtonElement = $state(document.createElement('button'));
  let subMenuContainer: HTMLDivElement = $state(document.createElement('div'));
   

  let renderedChildren = $derived(children.filter((ch, i) => {
    if (ch.type === 'separator') {
      if (i === 0) {
        return false;
      }
      if (!children.at(i - 1) || !children.at(i + 1)) {
        return false;
      }
      return true;
    }
    return true;
  }));

  let hasChildren = $derived(Boolean(renderedChildren.length));

  const [popperRef, popperContent] = createPopperActions({
    placement: 'right-start',
    strategy: 'fixed',
  });

  function handleCallback() {
    callback();
    active = false;
    // menuState.closeAction()
  }

  function handleFocus() {
    if (hasChildren && !active) {
      popperRef(itemRef)
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
    onfocus={handleFocus}
    onblur={handleBlur}
    onmouseover={handleFocus}
    onmouseleave={handleBlur}
    onclick={handleCallback}
    bind:this={itemRef}
  >
    {label}
    {#if hasChildren}
      <div class="has-children-icon">
        <Icon src={ChevronRight} size="1em" />
      </div>
      {#if active}
        <div class="menu-container sub-menu"
          use:popperContent
          bind:this={subMenuContainer}
        >
          {#each renderedChildren as ch}
            <Self
              type={ch.type}
              label={ch.label || ''}
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
    display: grid;
  }
</style>
