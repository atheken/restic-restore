<script lang="ts">
  import TextInput from "./TextInput.svelte";

  export let config: Record<string, string>;

  $: config.RESTIC_REPOSITORY = `azure:${config.REPO_ENDPOINT}:${config.REPO_PATH}`;
</script>

<TextInput
  bind:value={config.AZURE_ACCOUNT_NAME}
  placeholder="Azure Account Name"
  label="Account Name"
  pattern=".+"
/>

<TextInput
  bind:value={config.AZURE_ACCOUNT_KEY}
  type="password"
  placeholder="Azure Account Key"
  label="Account Key"
  pattern=".+"
/>

<TextInput
  bind:value={config.REPO_ENDPOINT}
  placeholder="foo"
  label="Blob Container"
  pattern=".+"
/>

<TextInput
  bind:value={config.REPO_PATH}
  placeholder="/"
  label="Repository Path"
  pattern="/.*"
/>
