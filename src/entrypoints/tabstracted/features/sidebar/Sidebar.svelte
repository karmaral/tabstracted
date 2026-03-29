<script lang="ts">
  import { programState, storageLoaded } from '$states';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Cog6Tooth, Plus } from '@steeze-ui/heroicons';
  import { SidebarList } from '.';
  import { LoadingWidget } from '$features/ui';
  import { newBlankWorkspace } from '$libF/middleware.svelte';


  function handleNewWorkspace() {
    newBlankWorkspace();
  }

  function handleSettingsClicked() {
    programState.settingsOpen = !programState.settingsOpen;
  }
</script>

<aside class="sidebar">
  <div class="logo">Tabstracted</div>
  {#if storageLoaded}
    <SidebarList />
    <div class="workspace-actions">
      <button
        class="new-workspace-btn btn"
        onclick={handleNewWorkspace}
      >
        <Icon src={Plus} size="1em" stroke-width={2} />
      </button>
    </div>
    <div class="sidebar-actions">
      <button 
        class="btn"
        onclick={handleSettingsClicked}
      >
        <Icon src={Cog6Tooth} size="1.25em" />
        Settings
      </button>
    </div>
  {:else}
    <LoadingWidget />
  {/if}
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    background: var(--theme-color-sidebar-bg);
    color: var(--theme-color-sidebar-fg);
    width: 20em;
    position: relative;
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 0;
    font-size: 1.5em;
    font-weight: lighter;
    color: rgb(0 0 0 / 40%);
    line-height: 2.5rem;
  }
  .workspace-actions {
    display: flex;
    flex-direction: column;
  }
  .new-workspace-btn {
    background: var(--theme-color-main-bg);
    font-size: 1.5em;
    flex-grow: 1;
    margin: .5rem;
    height: 2em;
    width: 2em;
  }
  .sidebar-actions {
    margin-top: auto;
    padding: .5rem;
    display: flex;
    flex-direction: column;
  }
  .sidebar-actions .btn {
    padding: .75em 1em;
    gap: .25em;
    background-color: unset;
    border: unset;
  }

</style>
