<script>
	export let files, previewImgUrl, dropHandler, pasteHandler;
	export let enablePaste = true;
	export let isLoading = false;

	let onDragover = false;

	const innerDragoverHandler = (event) => {
		event.preventDefault();
		onDragover = true;
	};

	const innderDragleaveHandler = (event) => (onDragover = false);

	const innerDropHandler = (event) => {
		event.preventDefault();
		dropHandler(event);
		onDragover = false; // reset dragover state after drop
	};

	const innerPasteHandler = (event) => {
		if (enablePaste) {
			event.preventDefault();
			pasteHandler(event);
		}
	};

	// Clear image preview
	const resetHandler = () => {
		previewImgUrl = undefined;
	};
</script>

<!-- Support for copy and paste -->
<svelte:window on:paste={innerPasteHandler} />

<!-- Drop and drop zone for image -->
<div
	class="bg-base-200 rounded-box p-5 text-center"
	role="application"
	aria-dropeffect="copy"
	on:drop={innerDropHandler}
	on:dragover={innerDragoverHandler}
	on:dragleave={innderDragleaveHandler}
>
	<!-- inner zone container -->
	<div
		class="rounded-box border-4 border-spacing-3 border-base-100 border-dashed p-5"
		class:!border-accent={onDragover}
	>
		<!-- Image preview zone -->
		{#if !previewImgUrl}
			<div class="instruction">
				<span class="material-symbols-rounded"> place_item </span> Drop image with equations
			</div>
			<div>or</div>
			<div class="instruction">
				<span class="material-symbols-rounded"> content_paste </span> Paste
				<span class="kbd kbd-sm">Ctrl + V</span> from clipboard
			</div>
			<div>or</div>
			<div class="instruction">
				<label>
					<!-- hidden input for manual file selection -->
					<i class="btn btn-accent"
						><span class="material-symbols-rounded">file_open</span>Select image</i
					>
					<input style="display: none;" type="file" bind:files />
				</label>
			</div>
		{:else}
			<div id="imgPreview" class="relative flex justify-center items-center">
				{#if isLoading}
					<!-- loading overlay -->
					<div class="absolute inset-0 flex justify-center items-center">
						<div class="loading loading-spinner loading-lg"></div>
					</div>
				{:else}
					<!-- reset indicator -->
					<button class="overlay-btn" on:click={resetHandler}>
						<span class="material-symbols-rounded">delete</span>
						Clear image
					</button>
				{/if}
				<img
					src={previewImgUrl}
					alt="Upload preview"
					class="transition-opacity"
					class:opacity-50={isLoading}
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	.overlay-btn {
		@apply absolute inset-0 flex justify-center items-center;
		@apply bg-base-300 bg-opacity-80 text-base-content text-lg font-semibold;
		@apply transition-opacity opacity-0 hover:opacity-100 hover:cursor-pointer;
	}

	.instruction {
		/* Rows of instructions */
		@apply my-2 font-semibold;
		@apply flex items-center justify-center gap-1; /* vertically and horizontally center */
	}
</style>
