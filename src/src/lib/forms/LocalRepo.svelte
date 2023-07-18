<script lang="ts">
  import TextInput from "./TextInput.svelte";
  let path = "";
  export let hidden = false;
</script>

{#if !hidden}
  <TextInput
    placeholder="/restic/repo/..."
    pattern=".+"
    label="Repository Path"
    bind:value={path}
  />
{/if}
