<script lang="ts">
  import { stack } from "./Navigation";

  let crumbs = stack;
</script>

<!--
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
-->
<nav aria-label="Breadcrumb">
  <ol class="flex items-center gap-1 text-sm text-gray-600 p-2 border-b-4">
    {#each $crumbs as c}
      <li class="after:content-['/'] last:after:content-['']">
        <a class="no-underline" href={c.link}>{c.name}</a>
      </li>
    {/each}
  </ol>
</nav>
