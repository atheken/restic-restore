<script lang="ts">
  import TextInput from "./TextInput.svelte";

  export let config: any;
</script>

<TextInput
  bind:value={config.REPO_ENDPOINT}
  placeholder="https://restic.example.com/repo"
  label="REST Base Url"
  pattern="^http(s)://.+"
/>
