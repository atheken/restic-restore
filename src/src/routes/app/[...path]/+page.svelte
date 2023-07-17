<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { relative } from "$lib/Helpers";
  import { filesize } from "filesize";
  import type { PageData } from "./$types";
  import setNav from "$lib/Navigation";

  export let data: PageData;

  page.subscribe((k) => {
    let parts = k.url.pathname.split("/").filter((k) => k.trim() != "");
    setNav(parts);
  });
</script>

<div class="w-full">
  {#key $page.url.pathname}
    {#if data.files.length == 0}
      <div class="text-center text-neutral-500 italic p-8">
        😬 There don't seem to be any any files in this directory.
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead>
            <tr class="text-left">
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
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
            {#each data.files as f}
              <tr class="hover:bg-neutral-100">
                <td
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  {#if !f.isDirectory}{f.name}
                  {:else}
                    <a href="./{f.name}">{f.name}</a>
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
                    }/${$page.params.path}${f.name}`}>Download</a
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/key}
</div>
