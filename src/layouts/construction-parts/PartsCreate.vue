<template>
	<BasePage title="Onderdeel toevoegen">
		<transition name="fade" mode="out-in" appear>
			<div v-if="!ui.loading && routeQuery.manage">
				<h2 v-if="routeQuery.manage === 'calculated'">Berekende kratten</h2>
				<h2 v-else>Onvoorzien/tekort kratten</h2>
				<form class="form" @submit.prevent="onAddingFlowersComplete()" style="margin-top: 20px">
					<FormInput
						v-for="(flower, flowerIdx) in allFlowers"
						:key="flowerIdx"
						:label="`${flower.id} - ${flower.name} (${flower.boxAmount} per krat)`"
						placeholder="Aantal kratten"
						v-model:value="flowerBatch[flower.id]"
						type="number"
						step=".1"
					/>
					<div class="batch" v-if="!ui.flowersLoading && allFlowers.length > 0">
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
			<div v-else-if="!ui.loading && !routeQuery.manage">
				<form class="form" @submit.prevent="handleSubmit(constructionPart)">
					<FormInput label="Naam onderdeel" placeholder="Naam onderdeel" v-model:value="constructionPart.name" />
					<FormInput label="Omschrijving" placeholder="Omschrijving" v-model:value="constructionPart.description" />
					<!-- <label for="input-three" class="f-label">Magische link (aan ander onderdeel):</label>
					<select id="input-three" class="f-input" v-model="user.corsoGroup" required>
						<option disabled>Selecteer onderdeel</option>
						<option v-for="group in corsoGroups" :key="group.id" v-bind:value="group">{{ group.name }}</option>
					</select> -->
					<hr style="border-color: #ddd; border-top: 0; width: 100%;" />
					<BoxListViewItem
						title="Berekende kratten"
						:sub="`${constructionPart.calculatedTotalAmountBoxes} krat (${constructionPart.calculatedTotalAmountFlowers} dahlia's)`"
						:onEdit="() => onAddingFlowerChange('calculated')"
					/>
					<BoxListViewItem
						title="Onvoorzien kratten"
						:sub="`${constructionPart.correctionTotalAmountBoxes} krat (${constructionPart.correctionTotalAmountFlowers} dahlia's)`"
						:onEdit="() => onAddingFlowerChange('correction')"
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
	import { ref, onMounted, computed, watchEffect, reactive } from "vue";
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
			const routePath = route.path;
			const routeQuery = computed(() => route.query);
			const partId = ref();

			const ui = reactive({
				loading: false,
				error: null,
				flowersLoading: true,
			});

			// Get constructionparts
			const constructionPart = ref({
				name: null,
				description: null,
				totalSurface: null,
				assignedBoxes: [],
				processedBoxes: [],
				processedTotalAmountFlowers: 0,
				calculatedFlowers: [],
				calculatedTotalAmountBoxes: 0,
				calculatedTotalAmountFlowers: 0,
				correctionFlowers: [],
				correctionTotalAmountBoxes: 0,
				correctionTotalAmountFlowers: 0,
			});

			// ------------------------
			// ---- Get existing constructionpart
			// ------------------------

			const buildCalculatedOnEdit = (part, type) => {
				if(type === "calculated") {
				part.calculatedFlowers.forEach((calculated) => {
						flowerBatch.value[calculated.id] = calculated.calculatedBoxes;
					});
				}
				else if(type === "correction") {
				part.correctionFlowers.forEach((calculated) => {
						flowerBatch.value[calculated.id] = calculated.calculatedBoxes;
					});
				}
			};
			watchEffect(() => {
				if(routeQuery.value.manage) {
					buildCalculatedOnEdit(constructionPart.value, routeQuery.value.manage)
				}
			})

			// Get data (if id specified in route)
			const getSingleConstructionPart = async (id) => {
				ui.loading = true;
				try {
					constructionPart.value = await fetchSingle(id).then((response) => {
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
						router.push({ name: "parts-list" });
					});
				} else {
					createItem(part).then(() => {
						router.push({ name: "parts-list" });
					});
				}
			};

			const handleDelete = (part) => {
				if (routeId && window.confirm("Weet je zeker dat je dit onderdeel wil verwijderen?")) {
					deleteItem(routeId, part).then(() => {
						router.push({ name: "parts-list" });
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

			const onAddingFlowerChange = (type) => {
				flowerBatch.value = {};
				router.push({ path: routePath, query: { manage: type } });
			};

			const onAddingFlowersComplete = () => {
				console.log(routeQuery.value.manage, flowerBatch.value)
				if (routeQuery.value.manage === "calculated") {
					constructionPart.value.calculatedTotalAmountBoxes = totalAmountToAdd.value.boxes;
					constructionPart.value.calculatedTotalAmountFlowers = totalAmountToAdd.value.flowers;
					constructionPart.value.calculatedFlowers = totalAmountToAdd.value.boxesArr;
				} else if (routeQuery.value.manage === "correction") {
					constructionPart.value.correctionTotalAmountBoxes = totalAmountToAdd.value.boxes;
					constructionPart.value.correctionTotalAmountFlowers = totalAmountToAdd.value.flowers;
					constructionPart.value.correctionFlowers = totalAmountToAdd.value.boxesArr;
				}
				flowerBatch.value = {};
				router.push({ path: routePath });
			};

			return {
				ui,
				routeId,
				routeQuery,
				constructionPart,
				allFlowers,
				flowerBatch,
				refresh: getSingleConstructionPart,
				getFlower,
				handleSubmit,
				handleDelete,
				onAddingFlowerChange,
				onAddingFlowersComplete,
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
