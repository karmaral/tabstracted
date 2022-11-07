<script lang="ts">
  import { currentWorkspace } from '$lib/stores';
  import EditableTitle from '$features/ui/editable-title.svelte';

  $: title = $currentWorkspace.title;

</script>

<div class="content-header">
  <div class="header-row">
  <h1 class="workspace-title">
    <EditableTitle {title} renameAction={console.log} />
  </h1>
  </div>
</div>

<style>
  .content-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1em;
  }
  .header-row {
    display: flex;
    align-items: center;
  }
  .workspace-title {
    padding: 1em;
  }

</style>
