<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let accountName: string;
  let accountKey: string;
  let container: string;
  let path: string;
</script>

<TextInput
  bind:value={accountName}
  placeholder="Azure Account Name"
  label="Account Name"
  pattern=".+"
/>

<TextInput
  bind:value={accountKey}
  type="password"
  placeholder="Azure Account Key"
  label="Account Key"
  pattern=".+"
/>

<TextInput
  bind:value={container}
  placeholder="foo"
  label="Blob Container"
  pattern=".+"
/>

<TextInput
  bind:value={path}
  placeholder="/"
  label="Respository Path"
  pattern="/.*"
/>
