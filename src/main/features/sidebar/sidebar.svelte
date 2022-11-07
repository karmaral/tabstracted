<script lang="ts">
  import { storageLoaded } from '$lib/stores';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Plus } from '@steeze-ui/heroicons';
  import { SidebarList } from '.';
  import { LoadingWidget } from '$features/ui';
  import { newBlankWorkspace } from '$lib/middleware';


  function handleNewWorkspace() {
    newBlankWorkspace();
  }
</script>

<aside class="sidebar">
  {#if $storageLoaded}
    <div class="logo">Tabstracted</div>
    <SidebarList />
    <div class="workspace-actions">
      <button
        class="new-workspace-btn btn"
        on:click={handleNewWorkspace}
      >
        <Icon src={Plus} size={'1em'} stroke-width={2} />
      </button>
    </div>
    <div class="sidebar-actions"></div>
  {:else}
    <LoadingWidget />
  {/if}
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    background: var(--theme-sidebar-bg);
    color: var(--theme-sidebar-fg);
    width: 20em;
    position: relative;
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em 0;
    font-size: 1.5em;
    font-weight: lighter;
    color: rgb(0 0 0 / 40%);
  }
  .workspace-actions {
    display: flex;
    flex-direction: column;
  }
  .new-workspace-btn {
    background: var(--theme-main-bg);
    font-size: 1.5em;
    flex-grow: 1;
    margin: .5rem;
    height: 2em;
    width: 2em;
  }

</style>
