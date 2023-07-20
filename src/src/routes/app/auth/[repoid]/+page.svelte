<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import ActiveButton from "$lib/forms/ActiveButton.svelte";
  import TextInput from "$lib/forms/TextInput.svelte";

  let password = "";
  let isValid = false;
  let repoid = $page.params.repoid;
  let redirect =
    $page.url.searchParams.get("returnPath") || `${base}/app/${repoid}/`;

  async function handleAuth(evt: MouseEvent) {
    evt.preventDefault();
    try {
      let result = await fetch("./", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ key: password }),
      });

      if (result.ok && (await result.json()).success) {
        await goto(redirect, { replaceState: true });
      } else {
        // show some feedback to the user.
      }
    } catch (err) {
      console.log(err);
    }
  }
</script>

<form on:input={(e) => (isValid = e.currentTarget.checkValidity())}>
  <div class="grid w-full gap-2 justify-items-center">
    <div class="grid w-2/3 gap-[1em]">
      <TextInput
        type="password"
        pattern=".+"
        bind:value={password}
        label="Access Key"
      />
      <ActiveButton enabled={isValid} on:click={handleAuth}
        >Unlock `{repoid}`</ActiveButton
      >
    </div>
  </div>
</form>
