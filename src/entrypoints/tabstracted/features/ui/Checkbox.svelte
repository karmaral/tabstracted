<script lang="ts">
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Check, MinusSmall } from '@steeze-ui/heroicons';

  interface Props {
    /**
     * If set to true, the pointer target
     * will span the height of its first `relative` container
     */
    draggable?: boolean;
    selected?: boolean;
    partialSelection?: boolean;
    onSelect?: () => void;
  };
  let {
    draggable = false,
    selected = false,
    partialSelection = false,
    onSelect = () => void 0,
  }: Props = $props();
</script>

<div class="select-box"
  class:rapid={draggable}
  class:selected
>
  {#if selected}
    <Icon 
      src={partialSelection ? MinusSmall : Check}
      size="1rem"
      stroke-width="3"
      class="icon"
    />
  {/if}
  <button 
    type="button"
    class="pointer-target"
    aria-label="Select"
    onclick={onSelect}>
  </button>
</div>

<style>
	.select-box {
    --size: 1.2rem;
		width: var(--size);
		height: var(--size);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgb(0 0 0 / 33%);

    &.selected {
      color: white;
      border-color: rgb(0 168 255);
      background-color: rgb(0 168 255);
    }
  }
	.pointer-target {
		cursor: pointer;
		width: calc(var(--size) + 2px);
		height: calc(var(--size) + 2px);
		position: absolute;
    border: unset;
    background: unset;
	}
  .rapid .pointer-target {
    height: unset;
    top: 0;
    bottom: 0;
  }

  /* .select-box :.icon {
    pointer-events: none;
    z-index: 1;
  } */
</style>
