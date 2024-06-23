<script>
	import Math from '$lib/components/Math.svelte';
	import DragDrop from '$lib/components/DragDrop.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';

	let equationImgs, imgForm, firstImgBase64, texOutput, errorMsg;
	let isLoading = false;

	export let form;

	const fileToBase64 = (file) => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => resolve(e.target.result);
		});
	};

	$: firstImgUrl = equationImgs ? URL.createObjectURL(equationImgs[0]) : undefined;
	$: if (equationImgs) {
		fileToBase64(equationImgs[0]).then((b64) => (firstImgBase64 = b64));
	} else {
		firstImgBase64 = undefined;
	}

	// auto submit if image input is already present
	$: if (firstImgBase64) {
		// wait for image input to be updated
		// otherwise, the form will be empty
		tick().then(() => {
			isLoading = true;
			submitForm();
		});
	}

	// form return handler
	$: if (form) {
		if (form.success) {
			isLoading = false;
			errorMsg = false;
			texOutput = form.texOutput;
		} else {
			isLoading = false;
			errorMsg = form.message;
		}
	}

	const dropHandler = (event) => {
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

	// retry handler for error alert
	const retryHandler = () => {
		errorMsg = undefined;
		submitForm();
	};

	const submitForm = () => {
		imgForm.requestSubmit();
	};
</script>

<!-- Flexbox wrapper -->
<div class="flex min-h-lvh items-center">
	<main class="container mx-auto my-5">
		<h1 class="text-4xl">Img2Tex</h1>
		<h2 class="text-xl">Easily convert images with equations to TeX commands.</h2>
		<section id="messages">
			{#if errorMsg}
				<ErrorAlert message={errorMsg} clickHandler={retryHandler} />
			{/if}
		</section>
		<section>
			<!-- Drop and drop zone for image -->
			<DragDrop
				bind:files={equationImgs}
				previewImgUrl={firstImgUrl}
				{isLoading}
				{dropHandler}
				{pasteHandler}
			/>

			<!-- Form for final submit -->
			<form
				id="imgForm"
				method="POST"
				enctype="multipart/form-data"
				action="?/postEquation"
				bind:this={imgForm}
				use:enhance={() => {
					return async ({ update }) => {
						await update({ reset: false });
					};
				}}
			>
				<input required type="hidden" name="equationImgBase64" value={firstImgBase64} />
			</form>
			<button type="submit" form="imgForm" class="button">Convert to TeX</button>
		</section>

		<section>
			<!-- Output -->
			{#if form?.texOutput}
				<h2>Output</h2>
				<pre id="texedit" contenteditable bind:textContent={texOutput}></pre>

				{#key texOutput}
					<!-- MathJax Preview -->
					<Math>$${texOutput}$$</Math>
				{/key}
			{/if}
		</section>
	</main>
</div>

<style>
	section {
		@apply my-6;
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
