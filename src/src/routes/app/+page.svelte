<script lang="ts">
  import { inlineSvg } from "@svelte-put/inline-svg";
  import { base } from "$app/paths";
  import Card from "$lib/Card.svelte";
  import { setPath } from "$lib/Navigation";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  onMount(() => setPath(true));
</script>

<div class="w-full">
  <div class="grid md:grid-cols-4 gap-2">
    {#each data.repos as r}
      <Card link="{base}/app/r/{r.Id}" title={r.Id}>
        <svg
          use:inlineSvg={`${base}/icons/backends/${r.type}.svg`}
          class="h-[2em] saturate-[0.25] group-hover:filter-none"
        />
      </Card>
    {/each}
  </div>
  <div
    class="grid place-items-center text-center mt-2 no-underline w-1/3 p-2 rounded-md hover:bg-green-700 bg-green-400 text-white"
  >
    <a href="{base}/app/add" class="flex no-underline text-white">
      <svg
        use:inlineSvg={`${base}/icons/add.svg`}
        class="fill-white h-[1.5em] grow-0"
      />
      <span>Add Repository</span>
    </a>
  </div>
</div>
