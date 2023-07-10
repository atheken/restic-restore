<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import ApiClient from "$lib/ApiClient";

  let snapshotid = $page.params.snapshotid;
  let repo = $page.params.repo;
  let restorePath = $page.url.searchParams.get("path");
  let pathname = $page.url.pathname;
  let baseSearch = $page.url.searchParams;

  function getPathUrl(path: string) {
    let search = new URLSearchParams(baseSearch);
    search.set("path", path);
    return `${pathname}?${search}`;
  }
</script>

<div class="font-mono">
  <div class="text-sm text-neutral-300">Path:</div>
  <div class="text-base">
    <a href="{base}/{repo}/">{repo}</a><span
      >/<a href="{base}/{repo}/{snapshotid}">{snapshotid.substring(0, 6)}</a>:
    </span>{#if restorePath}<span>{restorePath}</span>
    {/if}
  </div>
</div>

{#await ApiClient.FileList(repo, snapshotid, restorePath)}
  Loading snapshot files...
{:then files}
  <ul>
    {#each files as f}
      <li>
        {#if f.type == "file"}{f.name}
        {:else}<a href={getPathUrl(f.path)}>{f.name}</a>{/if}
      </li>
    {/each}
  </ul>
{/await}
