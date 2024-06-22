<script>
	import Math from '$lib/components/Math.svelte';
	import { enhance } from '$app/forms';

	let equationImgs;
	let firstImgUrl;
	let imgForm;
	let imgBase64;

	export let form;

	$: if (equationImgs) {
		// prepare preview
		firstImgUrl = URL.createObjectURL(equationImgs[0]);

		// convert image file to base64
		const reader = new FileReader();
		reader.readAsDataURL(equationImgs[0]);
		reader.onload = (e) => {
			imgBase64 = e.target.result;
		};
	}

	const dropHandler = (event) => {
		event.preventDefault();
		if (!event.dataTransfer.items[0].type.includes('image')) {
			return;
		} else {
			equationImgs = [...event.dataTransfer.files];
		}
	};

	// pasted image handler
	const pasteHandler = (event) => {
		event.preventDefault();
		// check if pasted file is an image
		if (!event.clipboardData.items[0].type.includes('image')) {
			return;
		} else {
			equationImgs = [...event.clipboardData.files]; // need to spread to make it work
		}
	};
</script>

<!-- Support for copy and paste -->
<svelte:window on:paste={pasteHandler} />

<div class="container">
	<main>
		<h1>LaTeX OCR Nougat</h1>
		<p>Easily convert images with equations to TeX commands.</p>
		<section>
			<!-- Drop and drop zone for image -->
			<div
				id="dropzone"
				role="application"
				aria-dropeffect="copy"
				on:drop={dropHandler}
				on:dragover={(e) => e.preventDefault()}
			>
				<!-- Image preview zone -->
				{#if !firstImgUrl}
					<p>Drag and drop image that contains equations</p>
					<p>or</p>
					<p>Paste (Ctrl + V) from clipboard</p>
					<p>or</p>
					<label>
						<!-- hidden input for manual file selection -->
						<i class="button">Select image manually</i>
						<input style="display: none;" type="file" bind:files={equationImgs} />
					</label>
				{:else}
					<img src={firstImgUrl} alt="Preview" />
				{/if}
			</div>

			<!-- Form for final submit -->
			<form
				id="imgForm"
				method="POST"
				enctype="multipart/form-data"
				action="?/postEquation"
				bind:this={imgForm}
				use:enhance
			>
				<input required type="hidden" name="equationImgBase64" value={imgBase64} />
			</form>
			<button type="submit" form="imgForm" class="button">Convert to TeX</button>
		</section>

		<section>
			<!-- Output -->
			{#if form?.texOutput}
				<h2>Output</h2>
				<pre id="texedit" contenteditable bind:textContent={form.texOutput}></pre>

				{#key form.texOutput}
					<!-- MathJax Preview -->
					<Math>$${form.texOutput}$$</Math>
				{/key}
			{/if}
		</section>
	</main>
</div>

<style>
	:root {
		--primary-color: rgb(56, 64, 72);
	}

	.container {
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h1 {
		text-align: center;
	}

	.button {
		background-color: var(--primary-color);
		color: white;
		border: none;
		margin: 0.5em;
		padding: 0.5em 1em;
		border-radius: 5pt;
		cursor: pointer;
	}

	main {
		height: 100vh;
		width: 60%;
	}

	section {
		margin: 2em 0em;
	}

	#dropzone {
		width: 100%;
		border: 2px dashed var(--primary-color);
		border-radius: 5pt;
		text-align: center;
		padding: 1rem;
	}

	#dropzone img {
		max-width: 100%;
	}

	#texedit {
		width: 100%;
		min-height: 8em;
		border: 2px solid var(--primary-color);
		border-radius: 5pt;
		padding: 0.7em;
		line-height: 1.5em;
		font-family: monospace;
		font-size: 12pt;
		white-space: pre-wrap;
	}
</style>
