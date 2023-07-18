<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let value: string;
</script>

<TextInput
  bind:value
  placeholder="https://restic.example.com/repo"
  label="REST Base Url"
  pattern="^http(s)://.+"
/>
