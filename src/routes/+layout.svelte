<script>
	import { PUBLIC_BASE_URL } from '$env/static/public';

	import '../app.css';
	import Footer from './Footer.svelte';
</script>

<svelte:head>
	<title>Img2TeX - Convert images with equations to TeX commands online.</title>
	<meta name="description" content="Easily convert images with equations to TeX commands." />
	<meta name="keywords" content="img2tex, image to tex, image to latex, image to math, image to equation" />
	<meta name="og:image" content="{PUBLIC_BASE_URL}/og-image.png" />
</svelte:head>

<slot />

<Footer />
