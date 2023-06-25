<script lang="ts">
    import { page } from "$app/stores";
    let repo = $page.params.repo;
</script>

You are attempting to access the `{repo}` repository, it needs to be
<a href="./{repo}/unlock">unlocked, first</a>
