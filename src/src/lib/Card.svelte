<script lang="ts">
  export let link: string;
  export let title: string;
</script>

<div
  class="group border-[1px] hover:border-gray-500 border-gray-300 rounded-md bg-blue-50 hover:bg-blue-100 text-center"
>
  <a href={link} class="no-underline font-light text-gray-800">
    <div class="grid gap-2 p-2 place-items-center w-full h-full">
      <slot />
      <div class="text-center">
        {title}
      </div>
    </div>
  </a>
</div>
