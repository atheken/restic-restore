<script lang="ts">
  export let options: { label: string; value: string }[] = [];
  export let value: string;
  export let label: string;

  let clazz: string = "";

  export { clazz as class };
</script>

<div class={clazz}>
  <label class="block text-sm after:content-[':']" for="backendType"
    >{label}</label
  >
  <select
    class="w-full border-neutral-300 rounded-md {clazz}"
    name="backendType"
    bind:value
  >
    {#each options as o}
      <option value={o.value}>{o.label}</option>
    {/each}
  </select>
</div>
