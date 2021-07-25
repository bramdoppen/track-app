<template>
	<router-view />
</template>

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
		--font-base: system-ui, sans-serif;
		--font-print: "Source Sans Pro", sans-serif;
		--fz-base: 16px;
		--p-side: 20px;
	}

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
		height: 100vh;
	}
</style>
