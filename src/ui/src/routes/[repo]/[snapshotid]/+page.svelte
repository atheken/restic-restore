<script lang="ts">
  import { page } from "$app/stores";

  let snapshotid = $page.params.snapshotid;
  let repo = $page.params.repo;

  let restore_path = $page.url.searchParams.get("path");
</script>

<div class="text-lg">
  <div class="text-sm text-neutral-300">Current Snapshot:</div>
  {repo}/{snapshotid}
</div>

{restore_path}
