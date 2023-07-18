<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let value: string;
</script>

<TextInput
  bind:value
  placeholder="ya29.a0AfH6SMC78..."
  label="Access Token"
  pattern=".*"
/>
