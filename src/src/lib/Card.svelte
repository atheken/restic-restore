<script lang="ts">
  export let link: string;
  export let title: string;
  export let imgSrc: string | null = null;
</script>

<div class="rounded-xl border-2 border-gray-100 bg-white">
  <div class="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
    {#if imgSrc}
      <a href={link} class="block shrink-0">
        <img src={imgSrc} alt={title} class="aspect-square" />
      </a>
    {/if}
    <div class="w-full">
      <div class="w-full font-medium sm:text-lg text-center">
        <a href={link} class="underline-none hover:underline">
          {title}
        </a>
      </div>
    </div>
  </div>
</div>
