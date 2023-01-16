<script lang="ts">

  export let width = '';

</script>

<ul class="content-list" style:width >
  <slot></slot>
</ul>

<style>
  .content-list {
    display: flex;
    flex-direction: column;
    gap: .3em;
    padding-inline: 0;
    max-width: var(--layout-max-item-width);
  }
</style>
