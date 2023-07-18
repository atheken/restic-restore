<script lang="ts">
  import AzureRepo from "$lib/forms/AzureRepo.svelte";
  import GoogleCloudRepo from "$lib/forms/GoogleCloudRepo.svelte";
  import LocalRepo from "$lib/forms/LocalRepo.svelte";
  import OpenStackRepo from "$lib/forms/OpenStackRepo.svelte";
  import RcloneRepo from "$lib/forms/RcloneRepo.svelte";
  import RestRepo from "$lib/forms/RestRepo.svelte";
  import S3Repo from "$lib/forms/S3Repo.svelte";
  import SftpRepo from "$lib/forms/SftpRepo.svelte";
  import TextInput from "$lib/forms/TextInput.svelte";
  import SelectInput from "$lib/forms/SelectInput.svelte";

  let name: string;
  let err: any;
  let backendType: string;
  let config: any = {};

  async function storeConfig() {
    try {
      let result = await fetch("./", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, config }),
      });

      let payload = (await result.json()) as { success: boolean; err: any };
      if (payload.success) {
      } else {
        err = payload.err;
      }
    } catch {
      err = "Storing of the configuration failed, please try again.";
    }
  }
</script>

<div class="grid w-full gap-3 justify-items-center">
  <div class="text-lg text-center font-medium">
    Add a Repository Configuration
  </div>
  <div class="w-2/3 grid gap-[1em]">
    <TextInput
      label="Friendly Name"
      bind:value={name}
      pattern="^[0-9a-z_.]+$"
      placeholder="A friendly name for this configuration."
    />

    <SelectInput
      label="Repository Type"
      bind:value={backendType}
      options={[
        { label: "Local", value: "local" },
        { label: "REST", value: "rest" },
        { label: "SFTP", value: "sftp" },
        { label: "S3-Compatible", value: "S3" },
        { label: "Azure", value: "azure" },
        { label: "Google Cloud Platform", value: "gcp" },
        { label: "OpenStack Swift", value: "openstack_swift" },
        { label: "RClone", value: "rclone" },
      ]}
    />

    {#if backendType == "S3"}
      <S3Repo bind:config />
    {:else if backendType == "local"}
      <LocalRepo bind:config />
    {:else if backendType == "rest"}
      <RestRepo bind:config />
    {:else if backendType == "gcp"}
      <GoogleCloudRepo bind:config />
    {:else if backendType == "azure"}
      <AzureRepo bind:config />
    {:else if backendType == "sftp"}
      <SftpRepo bind:config />
    {:else if backendType == "rclone"}
      <RcloneRepo bind:config />
    {:else if backendType == "openstack_swift"}
      <OpenStackRepo bind:config />
    {/if}
  </div>

  <button
    class="bg-blue-600 text-blue-50 p-3 rounded-md w-1/2 my-5"
    on:click={async () => await storeConfig()}>Add Repository</button
  >
</div>
