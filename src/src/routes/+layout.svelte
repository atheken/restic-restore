<script lang="ts">
  import Breadcrumbs from "$lib/Breadcrumbs.svelte";
  import { setNav } from "$lib/Navigation";
  import "../app.css";
  import Header from "$lib/Header.svelte";
  setNav();
</script>

<div class="container mx-auto">
  <Header />
  <Breadcrumbs />
  <div class="p-2">
    <slot />
  </div>
</div>
