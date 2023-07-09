<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import type { FileResult, Snapshot } from "$lib/ApiModels";
  import { fetchJson } from "$lib/Helpers";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let snapshotid = $page.params.snapshotid;
  let repo = $page.params.repo;
  let restorePath = $page.url.searchParams.get("path");
  let snapshot = writable<Snapshot>();
  let files = writable<FileResult[]>([]);

  onMount(async () => {
    try {
      var search = new URLSearchParams({ path: restorePath || "" });

      files.set(
        await fetchJson<FileResult[]>(
          `/api/snapshot/${repo}/${snapshotid}/ls?${search}`
        )
      );

      snapshot.set(
        await fetchJson<Snapshot>(`/api/snapshot/${repo}/${snapshotid}/info`)
      );
    } catch (err) {
      console.log(err);
    }
  });

  let pathname = $page.url.pathname;
  let search = $page.url.searchParams;

  function getPathUrl(path: string) {
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

<ul>
  {#each $files as f}
    <li>
      {#if f.type == "file"}{f.name}
      {:else}<a href={getPathUrl(f.path)}>{f.name}</a>{/if}
    </li>
  {/each}
</ul>
