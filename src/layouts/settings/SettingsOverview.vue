<template>
	<BasePage title="Instellingen">
		<BoxesList>
			<Box v-if="userPermissionLevel === 2">
				<h3>Wagenonderdelen</h3>
				<p>Beheer verschillende wagenonderdelen</p>
				<Button to="/parts/list" look="green" title="Wagenonderdelen"></Button>
			</Box>
			<Box v-if="userPermissionLevel === 2">
				<h3>Leveringen</h3>
				<p>Beheer verwachtte bloemleveringen (extern, intern en tekorten).</p>
				<Button to="/deliveries/list" look="green" title="Bloemleveringen"></Button>
			</Box>
			<!-- <Box v-if="userPermissionLevel === 2">
				<h3>Targets</h3>
				<p>Beheer targets per uur.</p>
				<Button to="/targets/create" look="green" title="Beheer targets"></Button>
			</Box> -->
			<Box v-if="userPermissionLevel === 2">
				<h3>Dahlias &#127804;</h3>
				<p>Dahliasoorten beheren</p>
				<Button to="/flowers/list" look="green" title="Dahliasoorten"></Button>
			</Box>
			<Box>
				<h3>Account &#128100;</h3>
				<p>Beheer jouw account</p>
				<Button to="/account/" look="green" title="Account"></Button>
			</Box>
		</BoxesList>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Box from "@/components/base/Box.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
	import store from "@/store";
	import { ref, computed } from "vue";

	export default {
		components: {
			BasePage,
			Box,
			BoxesList,
			Button,
		},
		setup() {
			const user = ref(store.state.user);
			return {
				userPermissionLevel: computed(() => {
					if (user.value) {
						return user.value.permissionLevel;
					} else {
						return 0;
					}
				}),
			};
		},
	};
</script>
