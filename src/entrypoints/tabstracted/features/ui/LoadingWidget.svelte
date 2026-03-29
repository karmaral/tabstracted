<script lang="ts">

  interface Props {
    message?: string;
    fontSize?: string;
  };
  let {
    message = 'Loading...',
    fontSize = '1em',
  }: Props = $props();

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
