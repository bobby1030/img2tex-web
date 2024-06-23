<script>
	export let files, previewImgUrl, dropHandler, pasteHandler;
	export let enablePaste = true;

	const innerDropHandler = (event) => {
		event.preventDefault();
		dropHandler(event);
	};

	const innerPasteHandler = (event) => {
		if (enablePaste) {
			event.preventDefault();
			pasteHandler(event);
		}
	};
</script>

<!-- Support for copy and paste -->
<svelte:window on:paste={innerPasteHandler} />

<!-- Drop and drop zone for image -->
<div
	class="dropzone"
	role="application"
	aria-dropeffect="copy"
	on:drop={innerDropHandler}
	on:dragover={(e) => e.preventDefault()}
>
	<!-- Image preview zone -->
	{#if !previewImgUrl}
		<p>Drag and drop image that contains equations</p>
		<p>or</p>
		<p>Paste (Ctrl + V) from clipboard</p>
		<p>or</p>
		<label>
			<!-- hidden input for manual file selection -->
			<i class="button">Select image manually</i>
			<input style="display: none;" type="file" bind:files />
		</label>
	{:else}
		<img src={previewImgUrl} alt="Preview" />
	{/if}
</div>

<style>
	.dropzone {
		width: 100%;
		border: 2px dashed var(--primary-color);
		border-radius: 5pt;
		text-align: center;
		padding: 1rem;
	}

	.dropzone img {
		max-width: 100%;
	}

	.button {
		cursor: pointer;
		background-color: var(--primary-color);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 2pt;
	}
</style>
