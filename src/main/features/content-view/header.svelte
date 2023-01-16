<script lang="ts">
  import { currentWorkspace } from '$lib/stores';
  import EditableTitle from '$features/ui/editable-title.svelte';

  $: title = $currentWorkspace.title;

  function handleRename(newVal: string) {
    console.log('update workspace name:', newVal);
  }

</script>

<div class="content-header">
  <div class="header-row">
    <EditableTitle {title}
      tag="h1"
      classList={['workspace-title']}
      renameAction={handleRename}
    />
  </div>
</div>

<style>
  .content-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1em;
		padding-block-end: .5rem;
  }
  .header-row {
    display: flex;
    align-items: center;
		gap: .5rem;
  }
  .content-header :global(.workspace-title) {
    margin-block: 0;
    padding: 1em;
    line-height: 1.5;
  }

</style>
