<template>
	<BasePage title="Kratten">
		<BoxesList>
			<Box :hidden="!isDesktop">
				<h3>Nieuwe kratten</h3>
				<p>Nieuwe kratten aanmaken</p>
				<Button to="/boxes/create" look="green" title="Nieuwe kratten"></Button>
			</Box>
			<Box>
				<h3>Runnermodus</h3>
				<p>Bloemkratten op nieuwe locatie inchecken</p>
				<Button to="/boxes/batch-scan" look="green" title="Start Runnermodus"></Button>
			</Box>
			<Box>
				<h3>Bekijk krat</h3>
				<p>Bekijk gegevens van een krat</p>
				<Button to="/boxes/scan" look="green" title="Scan krat"></Button>
			</Box>
			<Box>
				<h3>Alle kratten</h3>
				<p>Overzicht van alle kratten</p>
				<Button to="/boxes/list" look="green" title="Alle kratten"></Button>
			</Box>
		</BoxesList>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Box from "@/components/base/Box.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";

	export default {
		components: {
			BasePage,
			Box,
			BoxesList,
			Button,
		},
		setup() {
			return {
				isDesktop: window.innerWidth > 768,
			};
		},
	};
</script>

<style scoped>
	.desktop-only {
		@media (max-width: 48em) {
			display: none;
		}
	}
</style>
