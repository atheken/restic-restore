<script lang="ts">
  import TextInput from "./TextInput.svelte";
  export let config: Record<string, string>;
  $: config.RESTIC_REPOSITORY = `swift:${config.REPO_ENDPOINT}:${config.REPO_PATH}`;
</script>

<TextInput
  label="Swift Container"
  pattern=".+"
  placeholder="foo"
  bind:value={config.REPO_ENDPOINT}
/>
<TextInput
  label="Swift Container Path"
  pattern="/.*"
  placeholder="/"
  bind:value={config.REPO_PATH}
/>

<div class="text-center italic text-neutral-500">
  An OpenStack Swift-based repo can be configured to authenticate using
  environment variables, you may add them below.
</div>
