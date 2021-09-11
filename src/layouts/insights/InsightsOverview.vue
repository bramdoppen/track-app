<template>
	<BasePage title="Inzicht">
		<transition name="fade" mode="out-in" appear>
			<div v-if="allBoxes && allParts" class="container">
				<BoxesList gap="20px">
					<BoxesList>
						<div class="box-holder">
							<BoxListViewItem :title="`${totalProcessedBoxes.length}  &#128230;`" sub="verwerkt" />
							<BoxListViewItem :title="`${totalCalculated.percentage}%`" sub="afgerond" />
							<BoxListViewItem :title="`${totalCalculated.correctionBoxes.toFixed(1)} &#128230;`" sub="tekort" />
						</div>
					</BoxesList>
					<BoxesList gap="8px">
						<h2>Tekort</h2>
						<div class="light-message">
							<span v-if="!totalCalculated.correctionBoxes">Geen tekorten op dit moment &#9989;</span>
							<span v-else>Eventuele tekorten worden binnenkort getoond</span>
						</div>
					</BoxesList>
					<BoxesList gap="8px">
						<h2 style="margin-bottom: 10px;">Wagenonderdelen</h2>
						<div class="box-holder" style="margin-bottom: 10px;">
							<BoxListViewItem :title="`${totalCalculated.calculatedBoxes} &#128230;`" sub="totaal berekend" />
						</div>
						<BoxListViewItem v-for="item in filteredParts.active" :key="item.id" :title="item.name" onEditText="Bekijk" :onEdit="() => onEdit(item)">
							<div class="subitem">
								<Label state="warning" class="label" v-if="calculatePercentage(item) > 95">Check voor afronding</Label>
								<span>{{ calculatePercentage(item) }}% afgerond</span>
								<span v-if="item.correctionTotalAmountBoxes && item.correctionTotalAmountBoxes > 0">{{ item.correctionTotalAmountBoxes }} tekort</span>
							</div>
						</BoxListViewItem>
					</BoxesList>
					<BoxesList gap="8px" style="border-top:0;" v-if="filteredParts.completed.length > 0">
						<h3 style="margin-bottom: 10px;">Afgeronde onderdelen</h3>
						<BoxListViewItem v-for="item in filteredParts.completed" :key="item.id" :title="item.name" onEditText="Bekijk" :onEdit="() => onEdit(item)">
							<div class="subitem">
								<span>{{ calculatePercentage(item) }}% afgerond</span>
								<span v-if="item.correctionTotalAmountBoxes && item.correctionTotalAmountBoxes > 0">{{ item.correctionTotalAmountBoxes }} tekort</span>
							</div>
						</BoxListViewItem>
					</BoxesList>

					<BoxesList gap="8px">
						<h2>Kratten / Leveringen</h2>
						<span style="text-align: center; font-size: 0.8em; margin-bottom: 20px;">Overzicht geeft per dahliasoort aan hoeveel kratten besteld, binnen en al verwerkt zijn.</span>
						<table class="tableone" v-if="allFlowers && boxesPerState">
							<tr>
								<th style="width: 0">#</th>
								<th>Bloem</th>
								<th style="width: 0;padding:4px;">BS</th>
								<th style="width: 0;padding:4px;">CA</th>
								<th style="width: 0;padding:4px;">IN</th>
								<th style="width: 0;padding:4px;">AT</th>
								<th style="width: 0;padding:4px;">VW</th>
							</tr>
							<tr v-for="(flower, idx) in allFlowers" :key="idx">
								<td style="width: 0">{{ flower.id }}</td>
								<td>{{ flower.name }}</td>
								<td style="width: 0;padding:4px;; border-left: 1px solid gray;">{{ calculateOrdered(flower) }}</td>
								<td style="width: 0;padding:4px;">-</td>
								<td style="width: 0;padding:4px;">{{ boxesPerState[flower.id] ? boxesPerState[flower.id].total : 0 }}</td>
								<td style="width: 0;padding:4px;">{{ boxesPerState[flower.id] ? boxesPerState[flower.id].atPart : 0 }}</td>								
								<td style="width: 0;padding:4px;">{{ boxesPerState[flower.id] ? boxesPerState[flower.id].processed : 0 }}</td>								
							</tr>
						</table>
						<div style="padding: 20px;" v-else>Laden...</div>
						<div style="margin-top: 10px; font-size: 10px; font-style: italic;">CA = Berekend (Besteld extern + intern + tekort); <br />IN = Geregistreerd in systeem (incl verwerkt); <br> AT = Kratten bij een onderdeel;<br />VW = Verwerkt op wagen;</div>
						<Button to="/deliveries/list" title="Beheer leveringen" />
					</BoxesList>
					<BoxesList gap="8px">
						<h2>Gespijkerde kratten</h2>
						<span style="text-align: center; font-size: 0.8em; margin-bottom: 20px;">Deze kratten zijn klaar om op de wagen te gaan.</span>
						<Box style="padding:15px">
							<div class="chart-holder" >
								<BoxesPerStatus :rawBoxes="allBoxes" :state="2" :horizontal="true" style="height: 300px;"></BoxesPerStatus>
							</div>
						</Box>
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
	import Box from "@/components/base/Box.vue";
	import Label from "@/components/base/Label.vue";

	import BoxesList from "@/components/base/BoxesList.vue";
	import BoxesPerStatus from "@/components/charts/BoxesPerStatus.vue";
	import Button from "@/components/base/Button.vue";

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
			Box,
			Button,
			BoxesPerStatus,
			BoxesList,
			Label,
		},
		setup() {
			const store = useStore();
			const router = useRouter();

			const allBoxes = useFirestore(db.collection("boxes").where("state", "!=", null).where("state", "<", 5));
			const allFlowers = useFirestore(db.collection("flowerTypes"));
			const allParts = useFirestore(db.collection("constructionParts"));

			const filteredParts = computed(() => {
				const obj = {
					active: [],
					completed: [],
				};
				if (Array.isArray(allParts.value)) {
					const arr = [...allParts.value];
					obj.active = arr
						.filter((item) => !item.isCompleted)
						.sort((a, b) => {
							return calculatePercentage(b) - calculatePercentage(a);
						});
					obj.completed = arr.filter((item) => item.isCompleted);
				}
				return obj;
			});

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
				return allBoxes.value.filter((box) => {
					return box.state === 4;
				});
			});

			const boxesPerState = computed(() => {			
				const obj = {};
				allBoxes.value.forEach((box) => {
					if (!obj[box.flowerType.id]) {
						obj[box.flowerType.id] = {
							total: 0,
							atPart: 0,
							processed: 0,
						};
					}
					obj[box.flowerType.id].total += 1;
					if (box.state === 3) {
						obj[box.flowerType.id].atPart += 1;
					}
					if (box.state === 4) {
						obj[box.flowerType.id].processed += 1;
					}
				});
				return obj;
			});

			const totalCalculated = computed(() => {
				if (!allParts.value) {
					return;
				}
				const { calculatedTotal, correctionBoxes, calculatedBoxes } = useCalculateTotalPercentage(allParts.value);
				return {
					calculatedBoxes: parseFloat(calculatedBoxes.value).toFixed(2),
					percentage: calculatedTotal.value,
					correctionBoxes: correctionBoxes.value,
				};
			});

			const correction = computed(() => {
				// console.log(allFlowers.value);
				if (allFlowers.value) {
					console.log(allFlowers.value);
					// get all flowers and shortages on those flowers, per flower
					const shortagesOnFlowers = allFlowers.value.map((flower) => {
						return {
							id: flower.id,
							correction: flower.ordered ? flower.ordered.correction : 0,
						};
					});
					console.log(shortagesOnFlowers);
					// Get the shortages on constructionparts

					// Display the amount of shortages left.
				}
				return false;
			});

			const calculateOrdered = (item) => {
				if (item.ordered) {
					const external = parseFloat(item.ordered.external) || 0;
					const internal = parseFloat(item.ordered.internal) || 0;
					const correction = parseFloat(item.ordered.correction) || 0;
					return external + internal + correction;
				}
			};

			return {
				allBoxes,
				allParts,
				allFlowers,
				filteredParts,
				boxesPerState,
				onEdit,
				calculatePercentage,
				totalCalculated,
				totalProcessedBoxes,
				places: store.state.places,
				correction,
				calculateOrdered,
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
			column-gap: 0;
			row-gap: 0;
			grid-template-columns: 1fr;
			text-align: center;
			padding-left: 10px;
			padding-right: 10px;
		}
		& :deep(span.box-sub) {
			font-size: 12px;
		}
	}
	.container :deep(.list) > .list:not(:first-child) {
		border-top: 1px solid #ddd;
		padding-top: 20px;
	}
	h2, h3 {
		font-size: 18px;
		text-align: center;
	}
	h3 {
		font-size: 16px;
	}
	.light-message {
		text-align: center;
	}
	.subitem {
		display: grid;
		grid-template-columns: 1fr auto;
		column-gap: 20px;
		row-gap: 4px;

		& > .label {
			grid-column: 1 / -1;
			align-self: start;
			justify-self: start;
		}
	}
</style>
