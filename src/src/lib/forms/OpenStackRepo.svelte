<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let container: string;
  let path: string;
</script>

<TextInput
  label="Swift Container"
  pattern=".+"
  placeholder="foo"
  bind:value={container}
/>
<TextInput
  label="Swift Container Path"
  pattern="/.*"
  placeholder="/"
  bind:value={path}
/>

<div class="text-center italic text-neutral-500">
  An OpenStack Swift-based repo can be configured to authenticate using
  environment variables, you may add them below.
</div>
