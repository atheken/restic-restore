<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import ApiClient from "$lib/ApiClient";
  let repo = $page.params.repo;
</script>

{#await ApiClient.Snapshots($page.params.repo)}
  Loading snapshots...
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
