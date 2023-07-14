<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import ApiClient from "$lib/ApiClient";
  import { relative } from "$lib/Helpers";
  import nav from "$lib/Navigation";
  import Updated from "$lib/Updated.svelte";
  import { onMount } from "svelte";
  let repo = $page.params.repo;
  onMount(() => nav(repo));
</script>

{#await ApiClient.Snapshots($page.params.repo)}
  <div class="w-full text-center text-blue-800 animate-pulse">
    Loading snapshots...
  </div>
{:then snapshots}
  <ul>
    {#each snapshots as s}
      <li>
        <a href="{base}/app/{repo}/{s.id}/"> {s.id.substring(0, 6)}</a><br />
        <div class="text-xs text-neutral-300">
          {relative(s.time)} - {s.hostname}
        </div>
      </li>
    {/each}
  </ul>
  <Updated date={new Date()} />
{:catch err}
  <div class="w-full">
    <div class="text-center text-rose-800">
      Unable to load snapshots. This is the reason provided by the server:
    </div>
    {#if err instanceof String}
      <div class="text-center">
        {err}
      </div>
    {:else}
      <div class="font-mono text-left whitespace-pre-wrap">
        {JSON.stringify(JSON.parse(err.message), null, " ")}
      </div>
    {/if}
    <Updated date={new Date()} />
  </div>
{/await}
