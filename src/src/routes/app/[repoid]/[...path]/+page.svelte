<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { authUrl, relative } from "$lib/Helpers";
  import { filesize } from "filesize";
  import { setNav } from "$lib/Navigation";
  import type { FileStat } from "$lib/Restic";
  import { derived } from "svelte/store";
  import { goto } from "$app/navigation";

  let repoid = derived(page, (p) => p.params.repoid);
  let path = derived(page, (p) => p.params.path);
  let pathname = derived(page, (p) => {
    let result = p.url.pathname.split("/").filter((k) => k.trim() != "");
    result.shift();
    return result;
  });
  pathname.subscribe(setNav);
  setNav($pathname);

  async function loadFiles(): Promise<FileStat[]> {
    let req = fetch(`${base}/api/list/${$repoid}/${$path}`);

    try {
      let response = await req;
      return (await response.json()) as FileStat[];
    } catch (err) {
      goto(authUrl($repoid, $page.url.pathname));
      return [];
    }
  }
</script>

<div class="w-full">
  {#key $pathname}
    {#await loadFiles()}
      loading files...
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
                    {#if f.isDirectory}
                      <a href="./{f.name}">{f.name}</a>
                    {:else}
                      {f.name}
                    {/if}
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
                  >
                    <a
                      href={`${base}/api/download/${
                        f.isDirectory ? "dir" : "file"
                      }/${$repoid}/${$path}${f.name}`}>Download</a
                    >
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    {:catch err}
      Oops.. this thing didn't load: {err}
    {/await}
  {/key}
</div>
