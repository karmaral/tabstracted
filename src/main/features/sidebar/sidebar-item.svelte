<script lang="ts">
  import type { WorkspaceListRenderData } from '$types/render';
  import { EditableTitle } from '$features/ui';
  import { renameWorkspace } from '$lib/middleware';

  export let data: WorkspaceListRenderData;
  export let active: boolean = false;

  $: title = data.title;

  function handleRename(newVal: string): void {
    renameWorkspace(data.id, newVal);
  }

</script>

<div class="workspace-item" class:active>
  <div class="content">
    <div class="title">
      <EditableTitle {title} renameAction={handleRename}/>
      <span class="info"></span>
    </div>
    <button class="actions-btn"></button>
    <div class="actions">
    </div>
  </div>
</div>

<style>
  .workspace-item {
    padding: 1em;
    padding-left: 2em;
    font-weight: 500;
    border-bottom: 1px solid;
  }
  .workspace-item:hover {
    background-color: rgb(255 255 255 / 15%);
  }
  .workspace-item.active {
    border-left: 1em solid white;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
  }
  .info { font-size: .8em; }
</style>
