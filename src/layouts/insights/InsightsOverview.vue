<template>
	<BasePage title="Inzicht">
		<transition name="fade" mode="out-in" appear>
			<div v-if="!ui.loading && !ui.error">
				<BoxesList gap="20px">
					<BoxesList>
						<div class="box-holder">
							<BoxListViewItem :title="`${allBoxes.length}  &#128230;`" sub="verwerkt" />
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
			<div class="loading-panel error" v-else-if="ui.error && !ui.loading">
				<div style="padding: 20px;">Er is een error opgetreden bij het laden.</div>
				<Button @click="refresh()" look="green" title="Opnieuw laden" style="margin-top: 20px;"></Button>
			</div>
			<div class="loading-panel" v-else-if="ui.loading && !ui.error">
				<div style="padding: 20px;">Laden...</div>
			</div>
		</transition>
	</BasePage>
</template>

<script>
	import { ref, reactive, onMounted, computed } from "vue";
	import BasePage from "@/layouts/BasePage.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";

	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";

	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import { fetchAllBoxes } from "@/api/boxes.js";
	// import { fetchAll } from "@/api/constructionParts.js";
	import usePercentageCompleted from "@/composables/usePercentageCompleted";
	import useCalculateTotalPercentage from "@/composables/useCalculateTotalPercentage";
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
			const store = useStore();
			const router = useRouter();
			const ui = reactive({
				loading: true,
				error: null,
			});

			// Get all boxes
			const allBoxes = ref([]);
			// const allParts = ref([]);
			const getAll = async () => {
				ui.loading = true;
				try {
					allBoxes.value = await fetchAllBoxes().then((response) => {
						return response;
					});
					// allParts.value = await fetchAll().then((response) => {
					// 	return response;
					// });
				} catch (err) {
					ui.error = err;
				} finally {
					ui.loading = false;
				}
			};

			const allParts = useFirestore(db.collection("constructionParts"));

			onMounted(getAll);

			function onEdit(item) {
				router.push({ name: "boxes-detail", params: { id: item.id } });
			}

			function calculatePercentage(item) {
				const { calculatedPercentage } = usePercentageCompleted(item);
				return calculatedPercentage.value;
			}

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
				ui,
				allBoxes,
				allParts,
				onEdit,
				calculatePercentage,
				totalCalculated,
				places: store.state.places,
			};
		},
	};
</script>

<style scoped>
	.box-holder {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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
