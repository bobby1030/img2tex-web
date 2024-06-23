<script>
	import Math from '$lib/components/Math.svelte';
	import DragDrop from '$lib/components/DragDrop.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';

	let equationImgs, imgForm, firstImgBase64, texOutput, errorMsg;
	let isLoading = false;

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
	const formActionResultHandler = () => {
		return async ({ result, update }) => {
			if (result.data.success) {
				// form successfully returned data
				isLoading = false;
				errorMsg = false;
				texOutput = result.data.texOutput;
			} else {
				isLoading = false;
				errorMsg = result.data.message;
			}
			await update({ reset: false });
		};
	};

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
	<main class="container mx-auto my-5 bg-base-100">
		<section id="title">
			<h1 class="text-4xl my-4">Img2TeX</h1>
			<h2 class="text-xl">Easily convert images with equations to TeX commands.</h2>
		</section>
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
				use:enhance={formActionResultHandler}
			>
				<input required type="hidden" name="equationImgBase64" value={firstImgBase64} />
			</form>
		</section>
		<section id="controls" class="flex justify-center">
			<button
				type="submit"
				form="imgForm"
				class="btn btn-primary"
				class:btn-disabled={!firstImgBase64 | isLoading}
			>
				{#if isLoading}
					<div class="loading"></div>
				{/if}
				Convert to TeX
			</button>
		</section>

		<!-- Output -->
		<section id="output">
			<h2 class="text-2xl my-2">TeX Output</h2>
			<textarea
				id="texeditor"
				class="textarea textarea-border w-full min-h-36 bg-neutral text-neutral-content font-mono font-medium p-4"
				placeholder="TeX commands will appear here."
				bind:value={texOutput}
			></textarea>

			{#if texOutput}
				{#key texOutput}
					<!-- MathJax Preview -->
					<Math>$${texOutput}$$</Math>
				{/key}
				<button class="btn btn-primary" on:click={() => navigator.clipboard.writeText(texOutput)}>
					Copy to Clipboard
				</button>
			{/if}
		</section>
	</main>
</div>

<style>
	section {
		@apply mx-6 my-8;
	}
</style>
