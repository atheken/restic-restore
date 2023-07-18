<script lang="ts">
  export let value: string;
  export let pattern = "";
  export let placeholder = "";
  export let label: string;
  let clazz: string = "";
  export { clazz as class };
  export let type: "text" | "password" | "textarea" = "text";
</script>

<div>
  {#if type == "text"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <input
      id="name"
      bind:value
      type="text"
      {placeholder}
      {pattern}
      class="w-full border-neutral-300 rounded-md {clazz}"
    />
  {:else if type == "password"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <input
      id="name"
      bind:value
      type="password"
      {placeholder}
      {pattern}
      class="w-full border-neutral-300 rounded-md {clazz}"
    />
  {:else if type == "textarea"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <textarea
      id="name"
      {placeholder}
      bind:value
      class="w-full border-neutral-300 rounded-md {clazz}"
    />
  {/if}
</div>
