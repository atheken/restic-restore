<script lang="ts">
  import TextInput from "./TextInput.svelte";
  export let config: Record<string, string>;
  $: config.RESTIC_REPOSITORY = `sftp:${config.REPO_ENDPOINT}:${config.REPO_PATH}`;
</script>

<TextInput
  bind:value={config.REPO_ENDPOINT}
  placeholder="<user>@<host>:<port>:<repo path>"
  label="SFTP Remote"
  pattern=".+"
/>

<TextInput
  bind:value={config.SFTP_PRIVATE_KEY}
  type="password"
  placeholder="ssh-rsa AFAFB3Nxa1..."
  label="SSH Key"
  pattern=".+"
/>
