<script lang="ts">

  export let width = '';

</script>

<ul class="content-list" style:width >
  <slot />
</ul>

<style>
  .content-list {
    display: flex;
    flex-direction: column;
    gap: .3em;
    padding-inline: 0;
    min-width: var(--layout-min-item-width);
    max-width: var(--layout-max-item-width);
  }
</style>
