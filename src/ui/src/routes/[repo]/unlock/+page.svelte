<script lang="ts">
    export let params;
    import { page } from "$app/stores";
    let repo = $page.params.repo;
</script>

The repo must be unlocked via a password before you will be able to access
snapshots. You are attempting to access the `{repo}` repository. You should
unlock it before continuing.
