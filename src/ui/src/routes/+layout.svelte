<script lang="ts">
    import "../app.css";
    import Header from "../lib/Header.svelte";
    const ssr = false;
    const prerender = false;
    const trailingslash = "always";
</script>

<div class="container mx-auto">
    <Header />
    <div class="p-2 border-sky-100 border-solid border-8">
        <slot />
    </div>
</div>
