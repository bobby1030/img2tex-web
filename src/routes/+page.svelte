<script>
	let equationImgs;
	let firstImgUrl;
	
	export let form;

	if (form) console.log(form)

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
	<pre>{JSON.stringify(form.texOutput)}</pre>
{/if}
