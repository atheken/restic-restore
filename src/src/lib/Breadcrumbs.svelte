<script lang="ts">
  import { stack } from "./Navigation";

  let crumbs = stack;
</script>

<!--
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
-->
<nav aria-label="Breadcrumb">
  <ol
    class="flex flex-wrap items-center gap-1 text-sm text-gray-600 p-2 border-b-4"
  >
    {#each $crumbs as c, i}
      <li class="after:content-['/'] last:after:content-['']">
        {#if $crumbs.length - 1 > i}
          <a class="no-underline" href={c.link}>{c.name}</a>
        {:else}
          {c.name}
        {/if}
      </li>
    {/each}
  </ol>
</nav>
