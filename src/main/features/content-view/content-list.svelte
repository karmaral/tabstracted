<script lang="ts">

</script>

<div class="scroll-container">
  <div class="scroll-content">
    <ul class="content-list">
      <slot></slot>
    </ul>
  </div>
</div>

<style>
  .scroll-container {
    overflow: hidden auto;
    flex: 1 1;
  }
  .scroll-content {
    padding-bottom: 3rem;
  }
  .content-list {
    display: flex;
    flex-direction: column;
    gap: .3em;
    width: max-content;
  }
</style>
