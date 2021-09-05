<template>
	<BasePage title="Kratten">
		<BoxesList>
			<Box>
				<h3>Hi {{user.displayName}}, {{getRandomQuote()}}</h3>
			</Box>
			<Box :hidden="!isDesktop">
				<h3>Nieuwe kratten</h3>
				<p>Nieuwe kratten aanmaken</p>
				<Button to="/boxes/create" look="green" title="Nieuwe kratten"></Button>
			</Box>
			<Box>
				<h3>Runnermodus &#128248;</h3>
				<p>Bloemkratten op nieuwe locatie inchecken</p>
				<Button to="/boxes/batch-scan" look="green" title="Start Runnermodus"></Button>
			</Box>
			<Box>
				<h3>Bekijk krat &#128300;</h3>
				<p>Bekijk gegevens van een krat</p>
				<Button to="/boxes/scan?detail=true" look="green" title="Scan krat"></Button>
			</Box>
			<Box>
				<h3>Alle kratten</h3>
				<p>Overzicht van alle kratten</p>
				<Button to="/boxes/list" look="green" title="Alle kratten"></Button>
			</Box>
			<Box>
				<h3>Kratten uitchecken &#128163;</h3>
				<p>Verkocht aan andere groep? Haal krat uit systeem</p>
				<Button to="/boxes/sell" look="green" title="Kratten uitchecken"></Button>
			</Box>
		</BoxesList>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Box from "@/components/base/Box.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
  import { computed } from "vue";
  import { useStore } from "vuex";
	import { useWindowSize } from '@vueuse/core'

	export default {
		components: {
			BasePage,
			Box,
			BoxesList,
			Button,
		},
		setup() {
			const { width } = useWindowSize();
      const store = useStore();
      const randomQuotes = [
        "wat zit jouw haar leuk!",
        "zoals jij kratten scant, zo scant geen ander ze!",
        "glad to have you back.",
      ];

			return {
				isDesktop: computed(() => width.value > 768),
        user: computed(() => store.state.user),
        getRandomQuote: () => randomQuotes[Math.floor(Math.random() * randomQuotes.length)]
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
