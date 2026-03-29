<script lang="ts">
  import { programState } from "$lib/frontend/states.svelte";
  import { XMark } from "@steeze-ui/heroicons";
  import { Icon } from "@steeze-ui/svelte-icon";

  let ref: HTMLDialogElement = $state(document.createElement('dialog'));

  function close() {
    ref.close();
  }

  $effect(() => {
    if (programState.settingsOpen) {
      ref.showModal();
    }
  });

  onMount(() => {
    ref.addEventListener('close', () => {
      programState.settingsOpen = false;
    });
  });

</script>


<dialog 
  class="settings-dialog"
  bind:this={ref}
>
  <header>
    <h2 class="settings-title">Settings</h2>
    <div class="header-actions">
      <button 
        class="btn"
        onclick={close}
      >
        <Icon src={XMark} size="2.5em"/>
      </button>
    </div>
  </header>
  <aside></aside>
  <section></section>
  <footer></footer>
</dialog>

<style>
  .settings-dialog {
    min-width: 100ch;
    min-height: 60ch;
    border-radius: .25rem;
    border: 1px solid hsl(0 0% 0% / .5);
    box-shadow: 0 1.5em 2em -1em hsl(0 0% 0% / .25);
  }
  header {
    display: flex;
  }
  .header-actions {
    margin-left: auto;
  }
  .header-actions .btn {
    border: unset;
    background-color: unset;
    padding: .5rem;
  }
  .settings-title {
    margin: unset;
    font-size: 1.5rem;
    align-self: center;
  }


</style>