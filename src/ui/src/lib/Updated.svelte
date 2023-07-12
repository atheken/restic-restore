<script lang="ts">
  export let date: Date = new Date();
</script>

<div class="text-xs text-neutral-400 text-center">
  Updated: {date.toLocaleDateString()},
  {date.toLocaleTimeString()}
</div>
