<script lang="ts">
  export let value: string;
  export let pattern = "";
  export let placeholder = "";
  export let label: string;
  let clazz: string = "";
  export { clazz as class };
  export let type: "text" | "password" | "textarea" = "text";
  export let required = true;
  export let validationMessage = "";
</script>

<div>
  {#if type == "text"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <input
      autocomplete="off"
      {required}
      id="name"
      bind:value
      type="text"
      {placeholder}
      {pattern}
      class="peer w-full border-neutral-300 rounded-md invalid:border-red-400 placeholder:italic placeholder:text-neutral-300 {clazz}"
    />
  {:else if type == "password"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <input
      autocomplete="off"
      id="name"
      bind:value
      type="password"
      {placeholder}
      {required}
      {pattern}
      class="peer w-full border-neutral-300 rounded-md invalid:border-red-400 placeholder:text-neutral-300 {clazz}"
    />
  {:else if type == "textarea"}
    <label for="name" class="block text-sm after:content-[':']">{label}</label>
    <textarea
      autocomplete="off"
      id="name"
      {required}
      {placeholder}
      bind:value
      class="peer w-full border-neutral-300 rounded-md invalid:border-red-400 placeholder:text-neutral-300 {clazz}"
    />
  {/if}
  {#if validationMessage}
    <div class="invisible peer-invalid:visible text-sm text-red-800">
      {validationMessage}
    </div>
  {/if}
</div>
