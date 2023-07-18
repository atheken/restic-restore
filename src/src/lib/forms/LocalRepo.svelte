<script lang="ts">
  import TextInput from "./TextInput.svelte";

  export let config: any;
</script>

<TextInput
  placeholder="/restic/repo/..."
  pattern=".+"
  label="Repository Path"
  bind:value={config.REPO_PATH}
/>
