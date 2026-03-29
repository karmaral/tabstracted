<script lang="ts">
  import { currentWorkspace } from '$states';
  import { EditableTitle } from '$features/ui';

  let title = $derived(currentWorkspace.value.title);

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
    padding: 1.5rem;
    line-height: 2.5rem;
  }

</style>