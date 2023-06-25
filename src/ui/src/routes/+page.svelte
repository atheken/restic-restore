<script lang="ts">
    import { fetchJson } from "../lib/Helpers";
    import type { Repo, RepoList } from "../lib/ApiModels";
    import { onMount } from "svelte";

    let repos: Repo[] = [];

    onMount(async () => {
        repos = (await fetchJson<RepoList>("../api/repos")).repos;
    });
</script>

The following repos are defined:

<ul>
    {#each repos as r}
        <li><a href="./{r.Id}">{r.Id}</a></li>
    {/each}
</ul>
