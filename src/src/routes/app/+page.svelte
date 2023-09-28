<script lang="ts">
  import { inlineSvg } from "@svelte-put/inline-svg";
  import { base } from "$app/paths";
  import Card from "$lib/Card.svelte";
  import { setPath } from "$lib/Navigation";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  onMount(() => setPath(true, { name: "Repositories", link: null }));
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
  <div class="m-2 grid place-items-center">
    <a
      class="group relative inline-flex items-center overflow-hidden rounded bg-green-600 px-8 py-3 text-white focus:outline-none focus:ring hover:bg-green-500"
      href="{base}/app/add"
    >
      <span class="absolute">
        <svg
          use:inlineSvg={`${base}/icons/add.svg`}
          class="stroke-none fill-current h-5 w-5 grow-0"
        />
      </span>

      <span class="text-sm font-medium ms-6"> Add Repository </span>
    </a>
  </div>
</div>
