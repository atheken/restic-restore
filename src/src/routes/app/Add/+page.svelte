<script lang="ts">
  import AzureRepo from "$lib/forms/AzureRepo.svelte";
  import GoogleCloudRepo from "$lib/forms/GoogleCloudRepo.svelte";
  import LocalRepo from "$lib/forms/LocalRepo.svelte";
  import OpenStackRepo from "$lib/forms/OpenStackRepo.svelte";
  import RadioInput from "$lib/forms/RadioInput.svelte";
  import RcloneRepo from "$lib/forms/RcloneRepo.svelte";
  import RestRepo from "$lib/forms/RestRepo.svelte";
  import S3Repo from "$lib/forms/S3Repo.svelte";
  import SftpRepo from "$lib/forms/SftpRepo.svelte";
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
        { label: "Local", value: "local" },
        { label: "REST", value: "rest" },
        { label: "S3-Compatible", value: "S3" },
        { label: "Azure", value: "azure" },
        { label: "Google Cloud Platform", value: "gcp" },
        { label: "OpenStack Swift", value: "openstack_swift" },
        { label: "RClone", value: "rclone" },
      ]}
    />

    {#if backendType == "S3"}
      <S3Repo />
    {:else if backendType == "local"}
      <LocalRepo />
    {:else if backendType == "rest"}
      <RestRepo />
    {:else if backendType == "gcp"}
      <GoogleCloudRepo />
    {:else if backendType == "azure"}
      <AzureRepo />
    {:else if backendType == "sftp"}
      <SftpRepo />
    {:else if backendType == "rclone"}
      <RcloneRepo />
    {:else if backendType == "openstack_swift"}
      <OpenStackRepo />
    {/if}
  </div>

  <button
    class="bg-blue-600 text-blue-50 p-3 rounded-md w-1/2 my-5"
    on:click={async () => await storeConfig()}>Add Repository</button
  >
</div>
