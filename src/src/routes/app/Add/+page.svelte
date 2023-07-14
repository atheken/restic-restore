<script lang="ts">
  let password: string;
  let title: string;
  let config: string;

  async function storeConfig() {}
</script>

<div class="grid w-full gap-3 justify-items-center">
  <div class="text-lg text-center font-medium">
    Add a Repository Configuration
  </div>
  <div class="w-2/3">
    <label for="name" class="block text-sm"> Friendly Name:</label>
    <input
      id="name"
      bind:value={title}
      type="text"
      placeholder="A friendly name for this configuration."
      pattern="^[0-9a-z_.]+$"
      class="w-full"
    />
  </div>
  <div class="w-2/3">
    <label class="block text-sm" for="config">Configuration:</label>
    <textarea
      name="config"
      bind:value={config}
      rows="10"
      placeholder="A config file of restic env vars, one per line."
      class="w-full"
    />
  </div>
  <div class="w-2/3">
    <label for="password" class="block text-sm">Repository Password:</label>
    <input
      id="password"
      bind:value={password}
      placeholder="The repository password..."
      type="password"
      class="w-full"
    />
  </div>

  <button
    class="bg-blue-600 text-blue-50 p-3 rounded-md w-1/2 my-5"
    on:click={async () => await storeConfig()}>Add Repository</button
  >
</div>
