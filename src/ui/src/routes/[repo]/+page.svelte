<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import type { Snapshot } from "$lib/ApiModels";
  import { fetchJson } from "$lib/Helpers";
  let repo = $page.params.repo;

  let snapshots = fetchJson<Snapshot[]>(`../api/repo/${repo}`);
</script>

{#await snapshots}
  Loading Snapshots...
{:then snapshots}
  <ul>
    {#each snapshots as s}
      <li>
        <a href="{base}/{repo}/{s.id}/"> {s.id.substring(0, 6)}</a><br />
        <div class="text-xs text-neutral-300">{s.time} - {s.hostname}</div>
      </li>
    {/each}
  </ul>
{/await}
