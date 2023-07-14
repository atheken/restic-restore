<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import ApiClient from "$lib/ApiClient";
  import { relative } from "$lib/Helpers";
  import nav from "$lib/Navigation";
  import { derived } from "svelte/store";
  import { filesize } from "filesize";
  import { onMount } from "svelte";
  import type FileResult from "$lib/models/fileResult";

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

  function getDownloadUrl(path: string, type: "file" | "dir") {
    let search = new URLSearchParams(baseSearch);
    search.set("path", path);
    search.set("type", type);
    return `${base}/../api/snapshot/${repo}/${snapshotid}/download?${search}`;
  }

  async function loadFiles(): Promise<FileResult[]> {
    let set = await ApiClient.FileList(repo, snapshotid, $restorePath);
    return set.filter((k) => k.path != $restorePath);
  }

  restorePath.subscribe(async (r) => {
    nav(repo, snapshotid, r);
  });

  onMount(() => nav(repo, snapshotid, $restorePath));
</script>

<div class="w-full">
  {#key $restorePath}
    {#await loadFiles()}
      <div class="text-center text-blue-800 animate-pulse p-8">
        Loading files...
      </div>
    {:then files}
      {#if files.length == 0}
        <div class="text-center text-neutral-500 italic p-8">
          😬 There don't seem to be any any files in this directory.
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr class="text-left">
                <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Name
                </th>
                <th
                  class="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Update Time
                </th>
                <th
                  class="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  File Size
                </th>
                <th
                  class="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Recover
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              {#each files as f}
                <tr class="hover:bg-neutral-100">
                  <td
                    class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                  >
                    {#if f.type == "file"}{f.name}
                    {:else}<a href={getPathUrl(f.path)}>{f.name}</a>{/if}
                  </td>
                  <td
                    class="whitespace-nowrap px-4 py-2 text-center text-gray-700"
                    >{relative(f.mtime)}</td
                  >
                  <td
                    class="whitespace-nowrap px-4 py-2 text-center text-gray-700"
                    >{f.size
                      ? filesize(f.size, { base: 2, standard: "jedec" })
                      : "-"}</td
                  >
                  <td
                    class="whitespace-nowrap px-4 py-2 text-center text-gray-700"
                    ><a href={getDownloadUrl(f.path, f.type)}>Download</a></td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    {:catch}
      <div class="text-center text-red-800 p-8">
        Bummer, couldn't load the files...
      </div>
    {/await}
  {/key}
</div>
