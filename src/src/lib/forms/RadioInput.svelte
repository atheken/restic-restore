<script lang="ts">
  import { onMount } from "svelte";

  export let options: { label: string; value: string }[] = [];
  export let value: string | null = null;
  export let title: string;

  let clazz: string;

  export { clazz as class };

  onMount(() => {
    value = options[0]?.value;
  });
</script>

<div class="text-sm after:content-[':']">{title}</div>
<div class={clazz}>
  {#each options as o}
    <label class="align-middle" for="backendType"
      ><input
        type="radio"
        class="m-2 align-middle"
        name="backendType"
        id={o.value}
        value={o}
        checked={o.value == value}
        on:change={() => {
          value = o.value;
        }}
      />{o.label}</label
    >
  {/each}
</div>
