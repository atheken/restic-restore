<script lang="ts">
  import TextInput from "./TextInput.svelte";
  export let config: Record<string, string>;

  $: config.RESTIC_REPOSITORY = `s3:${config.REPO_ENDPOINT}${config.REPO_PATH}`;
</script>

<TextInput
  pattern=".+"
  placeholder="Key Name"
  bind:value={config.AWS_ACCESS_KEY_ID}
  label="Access Key ID"
/>

<TextInput
  pattern=".+"
  type="password"
  placeholder="Key Secret"
  bind:value={config.AWS_SECRET_ACCESS_KEY}
  label="Access Key Secret"
/>

<TextInput
  pattern="http(s)?://.+"
  placeholder="https://s3.us-east-2.amazonaws.com"
  bind:value={config.REPO_ENDPOINT}
  label="S3 Endpoint"
/>

<TextInput
  pattern="/.+"
  placeholder="/<bucket_name>/<restic_path...>"
  bind:value={config.REPO_PATH}
  label="Repository Path"
/>
