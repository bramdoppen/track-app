<template>
	<BasePage title="Verkoop krat">
		<BoxesList>
			<Box v-if="place != 3">
				<h3>Kratten uitchecken</h3>
        <p style="margin-bottom: 20px;">Haal kratten uit het systeem wanneer deze verkocht worden of naar jeugdwagen gaan.</p>
				<FormInput label="Reden verkoop:" placeholder="Vul hier de reden van verkoop in" v-model:value="reason" />
				<Button look="green" title="Start verkoop" @click="startSelling()"></Button>
			</Box>
		</BoxesList>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Box from "@/components/base/Box.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
	import FormInput from "@/components/base/form/FormInput.vue";

	import { ref } from "vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";

	export default {
		components: {
			BasePage,
			Box,
			BoxesList,
			Button,
			FormInput,
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			const reason = ref();

			function startSelling() {
				store.commit("changeCurrentAction", 6);
				store.commit("changeSellReason", reason.value);
				if (reason.value.length > 0) {
					router.push("/boxes/scan");
				}
			}

			return {
				reason,
				startSelling,
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
