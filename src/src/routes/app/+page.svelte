<script lang="ts">
  import { base } from "$app/paths";
  import Card from "$lib/Card.svelte";
  import { setNav } from "$lib/Navigation";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  onMount(() => setNav());
</script>

<div class="w-full">
  <div class="grid grid-cols-3 gap-2">
    {#each data.repos as r}
      <Card link="./{r.Id}" title={r.Id} />
    {/each}
    <Card link="./add" title="Add Repo" imgSrc="{base}/icons/add.svg" />
  </div>
</div>
