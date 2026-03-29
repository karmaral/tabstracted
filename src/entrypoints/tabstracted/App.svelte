<script lang="ts">
  import { init, refresh } from '$libF/middleware.svelte';
  import { MainView } from '$features/content-view';
  import Sidebar from '$features/sidebar';
  import SettingsWindow from '$features/settings-window';
  import { MenuHandler } from '$features/ui/menu';


  init();
</script>
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" >
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
	<link href="https://fonts.googleapis.com/css2?family=Radio+Canada:wght@300;400;500;600;700&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>
<svelte:window onfocus={refresh}></svelte:window>

<MenuHandler />
<Sidebar />
<MainView />
<SettingsWindow />

<style>
</style>
