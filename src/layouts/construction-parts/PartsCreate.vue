<template>
	<BasePage :title="`Onderdeel ${routeId ? 'beheren' : 'toevoegen'}`">
		<transition name="fade" mode="out-in" appear>
			<div v-if="!ui.loading && routeQuery.manage">
				<h2 v-if="routeQuery.manage === 'calculated'">Berekende kratten op {{constructionPart.name}}</h2>
				<h2 v-else>Onvoorzien/tekort kratten op {{constructionPart.name}}</h2>
				<form class="form" @submit.prevent="onAddingFlowersComplete()" style="margin-top: 20px">
					<span style="background: red; color: #fff; padding: 15px 20px; border-radius: 5px; margin-bottom: 20px;" v-if="routeQuery.manage === 'correction' && constructionPart.magicLink && constructionPart.magicLink.id !== routeId">Let op! Er is een magische link actief. Pas de master aan.</span>
					<span style="background: gray; color: #fff; padding: 15px 20px; border-radius: 5px; margin-bottom: 20px;" v-if="magicLinkedPartIds.length > 0">Dit onderdeel wordt door {{magicLinkedPartIds.length}} onderdelen gebruikt als magische link.</span>
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
					<hr style="border-color: #ddd; border-top: 0; width: 100%;" />

					<FormSelect
						label="Magische link (sync tussen onderdelen)"
						placeholder="Selecteer onderdeel als master"
						:options="partsWithId"
						v-model:value="constructionPart.magicLink"
						:disabled="routeId || magicLinkedPartIds.length > 0"
					/>
					<span style="font-size:0.8em;opacity:0.75; color: darkred;" v-if="magicLinkedPartIds.length > 0">Je kunt geen onderdeel selecteren, dit onderdeel wordt als magische link gebruikt.</span>
					<span style="font-size:0.8em;opacity:0.75;" v-else>Dit zorgt ervoor dat tekorten op de 'master' ook op dit onderdeel als indicatie aangegeven worden.</span>
					<hr style="border-color: #ddd; border-top: 0; width: 100%;" />

					<span v-if="deleteDisabled" style="text-align: center; margin-top: 10px; opacity: 0.6; font-size: 0.8em;">Verwijderen onderdeel is niet mogelijk</span>
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
	import FormSelect from "@/components/base/form/FormSelect.vue";
	import { useRoute, useRouter } from "vue-router";
	import { ref, onMounted, computed, watchEffect, reactive } from "vue";
	import { fetchSingle, createItem, updateItem, updateMagicLink, deleteItem } from "@/api/constructionParts.js";
	import { fetchFlowerTypes } from "@/api/flowerTypes.js";
	import { db } from "@/functions/firebaseConfig.js";
	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";

	export default {
		components: {
			BasePage,
			Button,
			FormInput,
			FormSelect,
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
				magicLink: null,
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
				if (type === "calculated") {
					part.calculatedFlowers.forEach((calculated) => {
						flowerBatch.value[calculated.id] = calculated.calculatedBoxes;
					});
				} else if (type === "correction") {
					part.correctionFlowers.forEach((calculated) => {
						flowerBatch.value[calculated.id] = calculated.calculatedBoxes;
					});
				}
			};
			watchEffect(() => {
				if (routeQuery.value.manage) {
					buildCalculatedOnEdit(constructionPart.value, routeQuery.value.manage);
				}
			});

			// Get all parts (usage for magic link)
			// Get constructionParts
			const allParts = useFirestore(db.collection("constructionParts"));
			const partsWithId = computed(() => {
				let arr = [];
				if (allParts.value) {
					const parts = [...allParts.value];
					arr = parts.map((part) => {
						return {
							id: part.id,
							name: part.name,
						};
					});
				}
				return arr;
			});

			// Get all parts where THIS part is magic-linked
			const magicLinkedPartIds = computed(() => {
				let arr = [];
				if(allParts.value) {
					const parts = [...allParts.value];
					arr = parts.filter((part) => {
						if(part.magicLink) {
							return part.magicLink.id === routeId
						}
					}).map(part => part.id)
				}
				return arr;
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
					const promises = [];
					if(magicLinkedPartIds.value && window.confirm(`Wil je de tekorten op dit onderdeel synchroniseren met de gelinkte wagenonderdelen (${magicLinkedPartIds.value.length}), of alleen dit item updaten?`)) {
						magicLinkedPartIds.value.forEach(link => {
							promises.push(updateMagicLink(link, part))
						})
					}

					promises.push(updateItem(routeId, part))
					Promise.all(promises).then(() => {
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
							if (val !== 0) {
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
				partsWithId,
				magicLinkedPartIds,
				flowerBatch,
				refresh: getSingleConstructionPart,
				getFlower,
				handleSubmit,
				handleDelete,
				onAddingFlowerChange,
				onAddingFlowersComplete,
				totalAmountToAdd,
				deleteDisabled: computed(() => {
					return constructionPart.value.assignedBoxes.length > 0 || constructionPart.value.processedTotalAmountFlowers > 0 || magicLinkedPartIds.value.length > 0;
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
