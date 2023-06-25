<script lang="ts">
    import { page } from "$app/stores";
    import type { Snapshot } from "$lib/ApiModels";
    import { fetchJson } from "$lib/Helpers";
    import { onMount } from "svelte";
    let repo = $page.params.repo;
    let snapshots: Snapshot[] = [];

    onMount(async () => {
        snapshots = await fetchJson<Snapshot[]>(`../api/repo/${repo}`);
    });
</script>

You are attempting to access the `{repo}` repository, it needs to be
<a href="./{repo}/unlock">unlocked, first</a>

<ul>
    {#each snapshots as s}
        <li>{s.id}</li>
    {/each}
</ul>
