<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import ApiClient from "$lib/ApiClient";
  import { relative } from "$lib/Helpers";
  let repo = $page.params.repo;
</script>

{#await ApiClient.Snapshots($page.params.repo)}
  <div class="w-full text-center text-blue-800 animate-pulse">
    Loading snapshots...
  </div>
{:then snapshots}
  <ul>
    {#each snapshots as s}
      <li>
        <a href="{base}/{repo}/{s.id}/"> {s.id.substring(0, 6)}</a><br />
        <div class="text-xs text-neutral-300">
          {relative(s.time)} - {s.hostname}
        </div>
      </li>
    {/each}
  </ul>
{:catch err}
  <div class="w-full text-center text-rose-800">
    Unable to load snapshots. :-/
  </div>
{/await}
