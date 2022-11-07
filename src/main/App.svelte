<script lang="ts">
  import './styles.css';
  import { init } from '$lib/middleware';
  import Sidebar from '$features/sidebar';
  import MainView from '$features/content-view';

  init();
</script>

<Sidebar />
<MainView />

<style>

</style>
