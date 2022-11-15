<script lang="ts">
import { Icon } from '@steeze-ui/svelte-icon'
import { Check } from '@steeze-ui/heroicons';

  /**
   * If set to true, the pointer target
   * will span the height of its first `relative` container
   */
  export let draggable = false;
  export let selected = false;
  export let onSelect: () => void;
</script>

<div class="select-box" class:rapid={draggable} >
  {#if selected}
    <Icon src={Check} size={'1rem'} stroke-width={3} />
  {/if}
  <div class="pointer-target" on:click={onSelect} ></div>
</div>

<style>
	.select-box {
    --size: 1rem;
		width: var(--size);
		height: var(--size);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgb(0 0 0 / 33%);
	}
	.pointer-target {
		cursor: pointer;
		width: calc(var(--size) + 2px);
		height: calc(var(--size) + 2px);
		position: absolute;
	}
  .rapid .pointer-target {
    height: unset;
    top: 0;
    bottom: 0;
  }
</style>
