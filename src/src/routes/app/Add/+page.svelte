<script lang="ts">
  import LocalRepo from "$lib/forms/LocalRepo.svelte";
  import RadioInput from "$lib/forms/RadioInput.svelte";
  import S3Repo from "$lib/forms/S3Repo.svelte";
  import TextInput from "$lib/forms/TextInput.svelte";

  let password: string;
  let title: string;
  let config: string;

  async function storeConfig() {
    let result = await fetch("./", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, title, config }),
    });
    let payload = (await result.json()) as { success: boolean };

    console.log(payload);
  }

  let backendType: string;
</script>

<div class="grid w-full gap-3 justify-items-center">
  <div class="text-lg text-center font-medium">
    Add a Repository Configuration
  </div>
  <div class="w-2/3 grid gap-[1em]">
    <TextInput
      label="Friendly Name"
      bind:value={title}
      pattern="^[0-9a-z_.]+$"
      placeholder="A friendly name for this configuration."
    />

    <RadioInput
      title="Repository Type"
      bind:value={backendType}
      class="justify-items-center"
      options={[
        { label: "S3-Compatible", value: "S3" },
        { label: "Local", value: "local" },
      ]}
    />

    {#if backendType == "S3"}
      <S3Repo />
    {:else if backendType == "local"}
      <LocalRepo />
    {/if}
  </div>

  <button
    class="bg-blue-600 text-blue-50 p-3 rounded-md w-1/2 my-5"
    on:click={async () => await storeConfig()}>Add Repository</button
  >
</div>
