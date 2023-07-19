<script lang="ts" context="module">
  export interface KeyValuePair {
    name: string;
    value: string;
  }
</script>

<script lang="ts">
  import TextInput from "./TextInput.svelte";
  export let envConfig: KeyValuePair[];
</script>

<div class="text-sm text-center font-medium italic">
  Additional Environment Variables:
</div>

{#each envConfig as e}
  <div class="border-[1px] border-neutral-200 p-2 rounded-md">
    <div class="flex gap-2 place-content-center">
      <div class="flex-1">
        <TextInput
          bind:value={e.name}
          label="Name"
          pattern="[\S]+"
          placeholder="RESTIC_TEST"
          validationMessage="The Variable Name is Required"
        />
      </div>
      <div class="flex-1">
        <TextInput
          bind:value={e.value}
          label="Value"
          pattern="[\S]+"
          placeholder="asdf-1234"
          validationMessage="The Variable Value is Required"
        />
      </div>
      <div class="flex place-content-center flex-initial">
        <button
          class=" text-red-800 underline text-right"
          on:click|preventDefault={() => {
            envConfig = envConfig.filter((k) => k != e);
          }}>Remove</button
        >
      </div>
    </div>
  </div>
{:else}
  <div class="text-neutral-400 italic text-center">
    There are no additional environment variables set. You may set them here.
  </div>
{/each}
<div class="flex grid-cols-3 gap-2 align-center place-content-end">
  <button
    class="border-blue-500 border-[1px] p-1 rounded-md text-white bg-blue-400"
    on:click|preventDefault={(el) => {
      envConfig = envConfig.concat([{ name: "", value: "" }]);
    }}>Add Variable</button
  >
</div>
