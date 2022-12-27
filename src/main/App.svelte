<script lang="ts">
  import './styles.css';
  import { init, refresh } from '$lib/middleware';
  import { MenuHandler } from '$features/ui/menu';
  import Sidebar from '$features/sidebar';
  import MainView from '$features/content-view';

  init();
</script>
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" >
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
	<link href="https://fonts.googleapis.com/css2?family=Radio+Canada:wght@300;400;500;600;700&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Asap:wght@300;400;500;600;700&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Signika:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>
<svelte:window on:focus={refresh}/>

<MenuHandler />
<Sidebar />
<MainView />

<style>

</style>
