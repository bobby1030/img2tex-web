<script>
	import Math from '$lib/components/Math.svelte';
	let equationImgs;
	let firstImgUrl;

	export let form;
	$: if (equationImgs) firstImgUrl = URL.createObjectURL(equationImgs[0]);
</script>

<h1>LaTeX OCR Nougat</h1>

<!-- Image to be OCR -->
<form method="POST" enctype="multipart/form-data" action="?/postEquation">
	<input type="file" name="equationImgs" bind:files={equationImgs} />
	<button type="submit">Submit</button>
</form>

<!-- Preview image -->
<img src={firstImgUrl} alt="Preview" />

<!-- Output -->
{#if form?.texOutput}
	<h2>Output</h2>
	<pre>{form.texOutput}</pre>

	{#key math}
		<!-- MathJax Preview -->
		<Math>$${form.texOutput}$$</Math>
	{/key}
{/if}
