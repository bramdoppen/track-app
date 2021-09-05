<template>
	<BasePage title="Alle Dahlia's">
		<transition name="fade" mode="out-in" appear>
			<BoxesList gap="8px" v-if="allDeliveries">
				<transition-group name="trans-list">
					<BoxListViewItem
						v-for="item in allDeliveries"
						:key="item.id"
						:title="`${item.id} - ${item.name}`"
						:sub="`${item.orderedAmount || 0} kratten besteld`"
						:onEdit="
							() => {
								onEdit(item);
							}
						"
					/>
				</transition-group>
			</BoxesList>
			<div class="loading-panel" v-else>
				<div style="padding: 20px;">Laden...</div>
			</div>
		</transition>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import { useRouter } from "vue-router";
	import { db } from "@/functions/firebaseConfig.js";

	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";

	export default {
		components: {
			BasePage,
      BoxesList,
			BoxListViewItem,
		},
		setup() {
			const router = useRouter();

			// Get flowerTypes
			const allDeliveries = useFirestore(db.collection("flowerTypes"));

			function onEdit(item) {
				router.push({ name: "deliveries-edit", params: { id: item.id } });
			}
			return {
				allDeliveries,
				onEdit,
			};
		},
	};
</script>
