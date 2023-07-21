<script lang="ts">
  import TextInput from "./TextInput.svelte";

  export let config: Record<string, string>;
  $: config.RESTIC_REPOSITORY = `rest:${config.REPO_ENDPOINT}${config.REPO_PATH}`;
</script>

<TextInput
  bind:value={config.REPO_ENDPOINT}
  placeholder="https://restic.example.com/repo"
  label="REST Base Url"
  pattern="^http(s)://.+"
/>
