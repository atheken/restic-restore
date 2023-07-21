<script lang="ts">
  import TextInput from "./TextInput.svelte";
  export let config: Record<string, string>;

  $: config.RESTIC_REPOSITORY = `gs:${config.REPO_ENDPOINT}:${config.REPO_PATH}`;
</script>

<TextInput
  bind:value={config.GOOGLE_ACCESS_TOKEN}
  placeholder="ya29.a0AfH6SMC78..."
  label="Access Token"
  pattern=".*"
/>

<TextInput
  bind:value={config.REPO_ENDPOINT}
  placeholder="foo"
  label="Bucket"
  pattern=".+"
/>

<TextInput
  bind:value={config.REPO_PATH}
  placeholder="/"
  label="Repository Path"
  pattern="/.*"
/>
