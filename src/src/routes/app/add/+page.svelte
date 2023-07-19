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
  import RepoCredentialsInput from "$lib/forms/RepoCredentialsInput.svelte";
  import ActiveButton from "$lib/forms/ActiveButton.svelte";
  import { setPath } from "$lib/Navigation";
  import { base } from "$app/paths";
  import { onMount } from "svelte";

  let name: string;
  let err: any;
  let backendType: string;
  let config: any = {};
  let step = 1;
  let step1valid = false;
  let step2valid = false;
  let accessKey = "";

  async function storeConfig() {
    try {
      let result = await fetch("./", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, accessKey, config }),
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

  onMount(() => {
    setPath(true, { link: `${base}/app/add`, name: "Add New Repository" });
  });
</script>

<div class="text-lg text-center font-medium">
  Add a Repository Configuration
</div>

<form
  class:hidden={step != 1}
  on:input|preventDefault={(e) =>
    (step1valid = e.currentTarget.checkValidity())}
  on:submit|preventDefault={async (e) => {
    if (e.currentTarget.checkValidity()) step = 2;
  }}
>
  <div class="grid w-full gap-3 justify-items-center">
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
      <div class="flex w-full place-content-center">
        <ActiveButton enabled={step1valid} class="w-1/2 my-5"
          >Next...</ActiveButton
        >
      </div>
    </div>
  </div>
</form>

<form
  class:hidden={step != 2}
  on:input|preventDefault={(e) =>
    (step2valid = e.currentTarget.checkValidity())}
  on:submit|preventDefault={async (e) => {
    if (e.currentTarget.checkValidity()) {
      await storeConfig();
    }
  }}
>
  <div class="grid w-full gap-3 justify-items-center">
    <div class="w-2/3 grid gap-[1em]">
      <RepoCredentialsInput
        bind:repoPassword={config.RESTIC_PASSWORD}
        bind:accessKey
      />
      <div class="flex w-full place-content-center gap-2 text-blue-500">
        <button class="underline" on:click={() => (step = 1)}>&lt; Back</button>
        <ActiveButton enabled={step2valid} class="w-1/2 my-5"
          >Save Repository</ActiveButton
        >
      </div>
    </div>
  </div>
</form>
