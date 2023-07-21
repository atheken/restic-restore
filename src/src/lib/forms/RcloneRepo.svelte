<script lang="ts">
  import TextInput from "./TextInput.svelte";

  export let config: Record<string, string>;

  $: config.RESTIC_REPOSITORY = `rclone:${config.REPO_ENDPOINT}:${config.REPO_PATH}`;
</script>

<TextInput
  bind:value={config.REPO_ENDPOINT}
  label="RClone Remote Name"
  pattern="[\S_^-]+"
  placeholder="The name of the remote that will be used by rclone."
/>

<TextInput
  bind:value={config.REPO_PATH}
  label="RClone Remote Path"
  pattern="/[\S]*"
  placeholder="/"
/>

<div class="text-center italic text-neutral-500">
  Rclone may require additional variables in order to access the remote you
  specify. These should be of the form `<span class="font-mono text-red-400"
    >RCLONE_{config.REPO_ENDPOINT?.toUpperCase() || "MYREMOTE"}_CONFIG_*</span
  >` , as per the rclone documentation.
</div>
