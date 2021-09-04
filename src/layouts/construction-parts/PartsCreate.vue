<template>
	<BasePage title="Onderdeel toevoegen">
		<transition name="fade" mode="out-in" appear>
			<div v-if="!ui.loading && ui.addingFlowers">
				<h2>Berekende kratten</h2>
				<form class="form" @submit.prevent="onCalculatedFlowerComplete()" style="margin-top: 20px">
					<FormInput
						v-for="(flower, flowerIdx) in allFlowers"
						:key="flowerIdx"
						:label="`${flower.id} - ${flower.name} (${flower.boxAmount} per krat)`"
						placeholder="Aantal kratten"
						v-model:value="flowerBatch[flower.id]"
					/>
					<div class="batch">
						<div v-for="(batchItem, batchItemId) in flowerBatch" :key="batchItemId">
							{{ batchItemId }}: {{ batchItem }} krat{{ batchItem != 1 ? "ten" : "" }} ({{ parseInt(batchItem * getFlower(batchItemId).boxAmount) }}) bloemen.
						</div>
						Totalen:
						{{ totalAmountToAdd.boxes }}
						{{ totalAmountToAdd.flowers }}
					</div>
					<Button type="submit" title="Opslaan" />
				</form>
			</div>
			<div v-else-if="!ui.loading && !ui.addingFlowers">
				<form class="form" @submit.prevent="handleSubmit(constructionPart)">
					<FormInput label="Naam onderdeel" placeholder="Naam onderdeel" v-model:value="constructionPart.name" />
					<FormInput label="Totale berekende kratten (automatisch)" placeholder="" :value="constructionPart.calculatedTotalAmountBoxes" disabled />
					<FormInput label="Totale berekende bloemen (automatisch)" placeholder="" :value="constructionPart.calculatedTotalAmountFlowers" disabled />
					<BoxListViewItem
						title="Berekende kratten"
						:sub="`${constructionPart.calculatedTotalAmountBoxes} krat (${constructionPart.calculatedTotalAmountFlowers} bloemen)`"
						:onEdit="
							() => {
								onCalculatedFlowerChange();
							}
						"
					/>
					<BoxListViewItem
						title="Onvoorzien kratten"
						:sub="`${constructionPart.correctionTotalAmountBoxes} krat (${constructionPart.correctionTotalAmountFlowers} bloemen)`"
						:onEdit="
							() => {
								onCalculatedFlowerChange();
							}
						"
					/>
					<span v-if="deleteDisabled" style="text-align: center; margin-top: 10px; opacity: 0.6; font-size: 0.8em;">Verwijderen is niet mogelijk</span>
					<Button type="button" title="Verwijderen" look="error" v-if="routeId" :disabled="deleteDisabled" @click="handleDelete(constructionPart)" />
					<Button type="submit" title="Opslaan" />
				</form>
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
	import BasePage from "@/layouts/BasePage.vue";
	import Button from "@/components/base/Button.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";
	import FormInput from "@/components/base/form/FormInput.vue";
	import { useRoute, useRouter } from "vue-router";
	import { ref, onMounted, computed, reactive } from "vue";
	import { fetchSingle, createItem, updateItem, deleteItem } from "@/api/constructionParts.js";
	import { fetchFlowerTypes } from "@/api/flowerTypes.js";

	export default {
		components: {
			BasePage,
			Button,
			FormInput,
			BoxListViewItem,
		},
		setup() {
			const route = useRoute();
			const router = useRouter();
			const routeId = route.params.id;
			const partId = ref();

			const ui = reactive({
				loading: false,
				error: null,
				flowersLoading: true,
				addingFlowers: false,
			});

			// Get constructionparts
			const constructionPart = ref({
				name: null,
				totalSurface: null,
				assignedBoxes: [],
				processedBoxes: [],
				processedTotalAmountFlowers: 0,
				calculatedTotalAmountBoxes: 0,
				calculatedTotalAmountFlowers: 0,
				correctionTotalAmountBoxes: 0,
				correctionTotalAmountFlowers: 0,
				calculatedFlowers: [],
			});

			// ------------------------
			// ---- Get existing constructionpart
			// ------------------------

			const buildCalculatedOnEdit = (response) => {
				if (response) {
					response.calculatedFlowers.forEach((calculated) => {
						flowerBatch.value[calculated.id] = calculated.calculatedBoxes;
					});
				}
			};

			// Get data (if id specified in route)
			const getSingleConstructionPart = async (id) => {
				ui.loading = true;
				try {
					constructionPart.value = await fetchSingle(id).then((response) => {
						buildCalculatedOnEdit(response);
						return response;
					});
				} catch (err) {
					ui.error = err;
				} finally {
					ui.loading = false;
				}
			};

			if (routeId) {
				partId.value = routeId;
				onMounted(() => getSingleConstructionPart(routeId));
			}

			// ------------------------
			// ---- Get flowertypes
			// ------------------------

			const allFlowers = ref([]);
			const flowerBatch = ref({});

			// Get data (if id specified in route)
			const getAllFlowers = async () => {
				ui.flowersLoading = true;
				allFlowers.value = await fetchFlowerTypes().then((response) => {
					ui.flowersLoading = false;
					return response;
				});
			};

			const getFlower = (id) => {
				return allFlowers.value.find((flower) => flower.id === id);
			};

			onMounted(getAllFlowers);

			// ------------------------
			// ---- Handle submits
			// ------------------------

			const handleSubmit = (part) => {
				if (routeId) {
					updateItem(routeId, part).then(() => {
						router.go(-1);
					});
				} else {
					createItem(part).then(() => {
						router.go(-1);
					});
				}
			};

			const handleDelete = (part) => {
				if (routeId && window.confirm("Weet je zeker dat je dit onderdeel wil verwijderen?")) {
					deleteItem(routeId, part).then(() => {
						router.go(-1);
					});
				}
			};

			const totalAmountToAdd = computed(() => {
				let boxes = 0;
				let flowers = 0;
				const boxesArr = [];
				if (Object.keys(flowerBatch).length > 0) {
					for (const flowerId in flowerBatch.value) {
						const val = flowerBatch.value[flowerId];
						const flower = getFlower(flowerId);
						if (val) {
							boxes += parseFloat(val);
							flowers += parseInt(val * flower.boxAmount);
							if (val > 0) {
								boxesArr.push({
									id: flowerId,
									name: flower.name,
									boxAmount: flower.boxAmount,
									calculatedBoxes: parseFloat(val).toFixed(2),
									calculatedFlowers: parseInt(val * flower.boxAmount),
								});
							}
						}
					}
				}
				return {
					boxes: boxes.toFixed(2),
					boxesArr,
					flowers,
				};
			});

			const onCalculatedFlowerChange = () => {
				ui.addingFlowers = true;
			};

			const onCalculatedFlowerComplete = () => {
				ui.addingFlowers = false;
				constructionPart.value.calculatedTotalAmountBoxes = totalAmountToAdd.value.boxes;
				constructionPart.value.calculatedTotalAmountFlowers = totalAmountToAdd.value.flowers;
				constructionPart.value.calculatedFlowers = totalAmountToAdd.value.boxesArr;
			};

			return {
				ui,
				routeId,
				constructionPart,
				allFlowers,
				flowerBatch,
				refresh: getSingleConstructionPart,
				getFlower,
				handleSubmit,
				handleDelete,
				onCalculatedFlowerChange,
				onCalculatedFlowerComplete,
				totalAmountToAdd,
				deleteDisabled: computed(() => {
					return constructionPart.value.assignedBoxes.length > 0 || constructionPart.value.processedTotalAmountFlowers > 0;
				}),
			};
		},
	};
</script>

<style scoped>
	.form {
		display: flex;
		flex-direction: column;
		text-align: left;
		gap: 15px;
	}
	ul {
		list-style: none;
		padding: 0;
	}
</style>
