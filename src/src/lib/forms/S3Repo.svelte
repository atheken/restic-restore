<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let keyId = "";
  let keySecret = "";
  let s3Endpoint = "";
  let repoPath = "";
  let hidden = false;
</script>

{#if !hidden}
  <TextInput
    pattern=".+"
    placeholder="Key Name"
    bind:value={keyId}
    label="Access Key ID"
  />

  <TextInput
    pattern=".+"
    type="password"
    placeholder="Key Secret"
    bind:value={keySecret}
    label="Access Key Secret"
  />

  <TextInput
    pattern="http(s)?://.+"
    placeholder="https://s3.us-east-2.amazonaws.com"
    bind:value={s3Endpoint}
    label="S3 Endpoint"
  />

  <TextInput
    pattern="/.+"
    placeholder="/<bucket_name>/<restic_path...>"
    bind:value={repoPath}
    label="Restic Path"
  />
{/if}
