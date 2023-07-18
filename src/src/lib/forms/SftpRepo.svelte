<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let remotePath: string;
  let sshKey: string;
</script>

<TextInput
  bind:value={remotePath}
  placeholder="<user>@<host>:<port>:<repo path>"
  label="SFTP Remote"
  pattern=".+"
/>

<TextInput
  bind:value={sshKey}
  type="password"
  placeholder="ssh-rsa AFAFB3Nxa1..."
  label="SSH Key"
  pattern=".+"
/>
