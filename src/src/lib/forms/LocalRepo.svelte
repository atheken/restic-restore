<script lang="ts">
  import TextInput from "./TextInput.svelte";

  export let config: Record<string, string>;

  $: config.RESTIC_REPOSITORY = config.REPO_PATH;
</script>

<TextInput
  placeholder="/restic/repo/..."
  pattern=".+"
  label="Repository Path"
  bind:value={config.REPO_PATH}
/>
