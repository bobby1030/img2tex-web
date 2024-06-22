<script>
	import { onMount } from 'svelte';

	onMount(() => {
		window.MathJax.typeset();
	});
</script>

<svelte:head>
	<script type="text/x-mathjax-config">
		MathJax.Hub.Config({
			tex2jax: {
				inlineMath: [
					['$', '$'],
					['\\(', '\\)']
				],
				displayMath: [
					['$$', '$$'],
					['\\[', '\\]']
				],
			},
		});
	</script>
</svelte:head>

<div id="math">
	<slot />
</div>
