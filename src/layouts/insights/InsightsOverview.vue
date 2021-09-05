<template>
	<BasePage title="Inzicht">
		<transition name="fade" mode="out-in" appear>
			<div v-if="allBoxes && allParts">
				<BoxesList gap="20px">
					<BoxesList>
						<div class="box-holder">
							<BoxListViewItem :title="`${totalProcessedBoxes.length}  &#128230;`" sub="verwerkt" />
							<BoxListViewItem :title="`${totalCalculated.percentage}%`" sub="afgerond" />
							<BoxListViewItem :title="`${totalCalculated.correctionBoxes} &#128230;`" sub="tekort" />
						</div>
					</BoxesList>
					<BoxesList gap="8px">
						<h2>Wagenonderdelen</h2>
						<BoxListViewItem
							v-for="item in allParts"
							:key="item.id"
							:title="item.name"
							:sub="`${calculatePercentage(item)}% afgerond | ${item.correctionTotalAmountBoxes} tekort`"
							onEditText="Bekijk"
							:onEdit="
								() => {
									onEdit(item);
								}
							"
						/>
					</BoxesList>
				</BoxesList>
			</div>
			<div class="loading-panel" v-else>
				<div style="padding: 20px;">Laden...</div>
			</div>
		</transition>
	</BasePage>
</template>

<script>
	import { computed } from "vue";
	import BasePage from "@/layouts/BasePage.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";

	import BoxesList from "@/components/base/BoxesList.vue";

	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import usePercentageCompleted from "@/composables/usePercentageCompleted";
	import useCalculateTotalPercentage from "@/composables/useCalculateTotalPercentage";
	import { db } from "@/functions/firebaseConfig.js";

	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";

	export default {
		components: {
			BasePage,
			BoxListViewItem,
			BoxesList,
		},
		setup() {
			const store = useStore();
			const router = useRouter();

			const allBoxes = useFirestore(db.collection("boxes"));
			const allParts = useFirestore(db.collection("constructionParts"));

			function onEdit(item) {
				router.push({ name: "parts-detail", params: { id: item.id } });
			}

			function calculatePercentage(item) {
				const { calculatedPercentage } = usePercentageCompleted(item);
				return calculatedPercentage.value;
			}

			const totalProcessedBoxes = computed(() => {
				if (!allBoxes.value) {
					return;
				}
				return allBoxes.value.filter(box => {
					return box.state === 4;
				})
			})

			const totalCalculated = computed(() => {
				if (!allParts.value) {
					return;
				}
				const { calculatedTotal, correctionBoxes } = useCalculateTotalPercentage(allParts.value);
				return {
					percentage: calculatedTotal.value,
					correctionBoxes: correctionBoxes.value,
				};
			});

			return {
				allBoxes,
				allParts,
				onEdit,
				calculatePercentage,
				totalCalculated,
				totalProcessedBoxes,
				places: store.state.places,
			};
		},
	};
</script>

<style scoped>
	.box-holder {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 8px;

		& :deep(.box-item) {
			text-align: center;
			padding-left: 10px;
			padding-right: 10px;
		}
		& :deep(span.box-sub) {
			font-size: 12px;
		}
	}
</style>
