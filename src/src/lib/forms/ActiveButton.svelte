<script lang="ts">
  export let enabled = true;

  let clazz = "";

  export { clazz as class };
</script>

<button
  class="bg-blue-600 text-blue-50 disabled:bg-neutral-200 disabled:text-neutral-500 p-2 rounded-md {clazz}"
  disabled={!enabled}><slot /></button
>
