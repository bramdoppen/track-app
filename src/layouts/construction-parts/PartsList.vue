<template>
	<BasePage title="Wagenonderdelen">
		<transition name="fade" mode="out-in" appear>
			<BoxesList gap="8px" v-if="allParts">
				<transition-group name="trans-list">
					<BoxListViewItem
						v-for="item in allParts"
						:key="item.id"
						:title="item.name"
						:sub="`${calculatePercentage(item)}% afgerond`"
						:onEdit="
							() => {
								onEdit(item);
							}
						"
					/>
				</transition-group>
				<Button to="/parts/create" look="green" title="Wagenonderdeel toevoegen"></Button>
			</BoxesList>
			<div class="loading-panel" v-else-if="!allParts">
				<div style="padding: 20px;">Laden...</div>
			</div>
		</transition>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
	import usePercentageCompleted from "@/composables/usePercentageCompleted";
	import { useRouter } from "vue-router";

	import { db } from "@/functions/firebaseConfig.js";

	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";

	export default {
		components: {
			BasePage,
			BoxListViewItem,
			BoxesList,
			Button,
		},
		setup() {
			const router = useRouter();

			// Get constructionParts
			const allParts = useFirestore(db.collection("constructionParts"));

			function onEdit(item) {
				router.push({ name: "parts-edit", params: { id: item.id } });
			}

			function calculatePercentage(item) {
				const { calculatedPercentage } = usePercentageCompleted(item);
				return calculatedPercentage.value;
			}

			return {
				allParts,
				onEdit,
				calculatePercentage,
			};
		},
	};
</script>
