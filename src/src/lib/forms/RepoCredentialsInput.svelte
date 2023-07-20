<script lang="ts">
  import TextInput from "./TextInput.svelte";

  export let repoPassword: string;
  export let primaryKey: string;
</script>

<TextInput
  pattern=".+"
  placeholder="Secret_!23#"
  label="Repository Password"
  bind:value={repoPassword}
  type="password"
  validationMessage="The repository password is required. This should be one of the keys you specified when creating the restic repository."
/>

<TextInput
  pattern="^[\S]{'{10,}'}$"
  placeholder="***"
  label="Access Key"
  bind:value={primaryKey}
  type="password"
  validationMessage="The access key must be at least 10 non-whitespace characters."
/>
