<script>
  import { base } from "$app/paths";
  import ApiClient from "$lib/ApiClient";
  import Card from "$lib/Card.svelte";
  import setNav from "$lib/Navigation";
  import { onMount } from "svelte";

  onMount(() => setNav());
</script>

<div class="w-full">
  {#await ApiClient.Repos()}
    <div class="w-full text-center text-blue-800 animate-pulse">
      Loading repos...
    </div>
  {:then repos}
    <div class="grid grid-cols-3 gap-2">
      {#each repos as r}
        <Card link="./{r.Id}" title={r.Id} />
      {/each}
      <Card link="./Add" title="Add Repo" imgSrc="{base}/icons/add.svg" />
    </div>
  {:catch}
    <div class="w-full text-center text-rose-500">
      Failed to load repos. Please reload the page to try again.
    </div>
  {/await}
</div>
