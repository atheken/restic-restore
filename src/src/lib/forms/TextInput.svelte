<script lang="ts">
  export let value: string;
  export let pattern = "";
  export let placeholder = "";
  export let label: string;
  let clazz: string = "";
  export { clazz as class };
  export let type: "text" | "password" | "textarea" = "text";
  export let required = true;
</script>

<div>
  {#if type == "text"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <input
      {required}
      id="name"
      bind:value
      type="text"
      {placeholder}
      {pattern}
      class="w-full border-neutral-300 rounded-md invalid:border-red-400 {clazz}"
    />
  {:else if type == "password"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <input
      id="name"
      bind:value
      type="password"
      {placeholder}
      {required}
      {pattern}
      class="w-full border-neutral-300 rounded-md invalid:border-red-400 {clazz}"
    />
  {:else if type == "textarea"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <textarea
      id="name"
      {required}
      {placeholder}
      bind:value
      class="w-full border-neutral-300 rounded-md invalid:border-red-400 {clazz}"
    />
  {/if}
</div>
