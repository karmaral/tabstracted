<script lang="ts">

export let message  = 'Loading...';
export let fontSize = '1em';
</script>

<div
  class="loading-widget"
  style="{fontSize ? `--font-size: ${fontSize}` : ''}"
>
  {message}
</div>

<style>
  .loading-widget {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: var(--font-size, 1em);
    height: 100%;
    width: 100%;
    position: relative;
    opacity: .7;
  }
</style>
