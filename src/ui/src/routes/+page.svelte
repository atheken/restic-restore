<script>
  import ApiClient from "$lib/ApiClient";
</script>

{#await ApiClient.Repos()}
  Loading repos...
{:then repos}
  <ul>
    {#each repos as r}
      <li><a href="./{r.Id}">{r.Id}</a></li>
    {/each}
  </ul>
{/await}
