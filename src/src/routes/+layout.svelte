<script lang="ts">
  import Breadcrumbs from "$lib/Breadcrumbs.svelte";
  import { setPath } from "$lib/Navigation";
  import "../app.css";
  import Header from "$lib/Header.svelte";
  $: setPath(true);
</script>

<div class="container mx-auto">
  <Header />
  <Breadcrumbs />
  <div class="p-2">
    <slot />
  </div>
</div>
