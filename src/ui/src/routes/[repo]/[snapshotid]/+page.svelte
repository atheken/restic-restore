<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import ApiClient from "$lib/ApiClient";
  import { derived } from "svelte/store";

  let snapshotid = $page.params.snapshotid;
  let repo = $page.params.repo;
  let restorePath = derived(page, (p) => p.url.searchParams.get("path"));
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
    </span>{#if $restorePath}<span>{$restorePath}</span>
    {/if}
  </div>
</div>

<div class="w-full">
  {#await ApiClient.FileList(repo, snapshotid, $restorePath)}
    <div class="text-center text-blue-800 animate-pulse">
      Loading snapshot files...
    </div>
  {:then files}
    <ul>
      {#each files as f}
        <li>
          {#if f.type == "file"}{f.name}
          {:else}<a href={getPathUrl(f.path)}>{f.name}</a>{/if}
        </li>
      {/each}
    </ul>
  {:catch}
    <div class="text-rose-800 text-center">
      Bummer! The path couldn't be loaded.
    </div>
  {/await}
</div>
