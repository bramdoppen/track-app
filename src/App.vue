<template>
	<router-view />
</template>
<script>
	let vh = window.innerHeight * 0.01;
	// Then we set the value in the --vh custom property to the root of the document
	document.documentElement.style.setProperty("--vh", `${vh}px`);
</script>
<style>
	:root {
		--m-small: 10px;
		--m-base: 25px;
		--color-bg: #fefcf9;
		--color-primary: #6369d1;
		--color-secondary: #6ea4bf;
		--color-dark: var(--color-text);
		--color-text: #393e41;
		--color-border: #979797;
		--color-error: red;
		--font-special: "Bungee", "Arial Black", sans-serif;
		--font-title: "Inter", "Arial Black", sans-serif;
		--font-base: "Inter", sans-serif;
		--font-print: "Source Sans Pro", sans-serif;
		--fz-base: 16px;
		--p-side: 20px;
	}
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;600;700&display=swap');
	@font-face {
		font-family: "Bungee";
		src: url("/fonts/Bungee-Regular_20200107.woff2") format("woff2"), url("/fonts/Bungee-Regular_20200107.woff") format("woff");
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	html,
	body {
		margin: 0;
		overflow: hidden;
	}
	body {
		font-family: var(--font-base);
	}
	* {
		box-sizing: border-box;
	}
	h1,
	h2,
	h3,
	h4 {
		font-family: var(--font-title);
		font-weight: 600;
		margin: 0;
	}

	h1 {
		font-size: 28px;
	}

	h2 {
		font-size: 24px;
	}

	#app {
		height: 100vh; /* Fallback for browsers that do not support Custom Properties */
		height: calc(var(--vh, 1vh) * 100);
		overflow: hidden;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.15s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	.trans-list-enter-active,
	.trans-list-leave-active {
		transition: opacity 0.2s ease;
	}
	.trans-list-enter-from,
	.trans-list-leave-to {
		opacity: 0;
	}
</style>
