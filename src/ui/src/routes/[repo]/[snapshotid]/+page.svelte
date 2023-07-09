<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { fetchJson } from "$lib/Helpers";

  let snapshotid = $page.params.snapshotid;
  let repo = $page.params.repo;

  let restore_path = $page.url.searchParams.get("path");
</script>

<div>
  <div class="text-sm text-neutral-300">Current Snapshot:</div>
  <div class="text-lg"><a href="{base}/{repo}/">{repo}</a> {snapshotid}</div>
</div>

{#await fetchJson(`../../api/snapshot/${repo}/${snapshotid}/info`)}
  Loading snapshot details...
{:then snapshot}
  <div class="whitespace-pre font-mono">
    {JSON.stringify(snapshot, null, " ")}
  </div>
{/await}
