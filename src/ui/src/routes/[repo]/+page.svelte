<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import type { Snapshot } from "$lib/ApiModels";
  import { fetchJson } from "$lib/Helpers";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  let repo = $page.params.repo;
  let snapshots = writable<Snapshot[]>([]);

  onMount(async () => {
    try {
      snapshots.set(await fetchJson<Snapshot[]>(`../api/repo/${repo}`));
    } catch (err) {
      console.error(err);
    }
  });
</script>

<ul>
  {#each $snapshots as s}
    <li>
      <a href="{base}/{repo}/{s.id}/"> {s.id.substring(0, 6)}</a><br />
      <div class="text-xs text-neutral-300">{s.time} - {s.hostname}</div>
    </li>
  {/each}
</ul>
