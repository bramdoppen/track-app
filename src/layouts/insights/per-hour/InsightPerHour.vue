<template>
	<BasePage title="Per uur">
		<transition name="fade" mode="out-in" appear>
			<div v-if="allBoxes && allParts" class="container">
				<BoxesList gap="20px">
					<BoxesList gap="8px">
						<h2>Afgerond per uur</h2>
						<span style="text-align: center; font-size: 0.8em; margin-bottom: 20px;">Deze kratten zijn klaar om op de wagen te gaan.</span>
						<Box style="padding:15px">
							<BoxesPerHour :rawBoxes="processedBoxesPerHour" style="height: 300px;" v-if="processedBoxesPerHour"></BoxesPerHour>
							<ul>
								<li v-for="(boxesArr, key) in processedBoxesPerHour" :key="key">
									{{ dayjs(key).format("DD MMMM YYYY, HH:mm") }}
									{{ boxesArr.length }}
									<button>Bekijk kratten</button>
									<ul>
										<li v-for="(box, boxKey) in boxesArr" :key="boxKey">
											{{ box.id }}
											{{ box.flowerType.id }}
											{{ box.flowerType.name }}
											{{ dayjs(box.updatedOn.seconds * 1000).format("HH:mm") }}
										</li>
									</ul>
								</li>
							</ul>
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
	import Box from "@/components/base/Box.vue";

	import BoxesList from "@/components/base/BoxesList.vue";
	import BoxesPerHour from "@/components/charts/BoxesPerHour.vue";

	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import usePercentageCompleted from "@/composables/usePercentageCompleted";
	import useCalculateTotalPercentage from "@/composables/useCalculateTotalPercentage";
	import { db } from "@/functions/firebaseConfig.js";

	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";
	import dayjs from "dayjs";

	export default {
		components: {
			BasePage,
			Box,
			BoxesPerHour,
			BoxesList,
		},
		setup() {
			const store = useStore();
			const router = useRouter();

			const allBoxes = useFirestore(
				db
					.collection("boxes")
          .where("belongsToCorsoGroup.id", "==", store.state.corsoGroup.id)
					.where("state", "!=", null)
					.where("state", "<=", 5),
			);
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

			const processedBoxesPerHour = computed(() => {
				const processedByDayHour = {};
				allBoxes.value.forEach((box) => {
					if (box.state === 4) {
						const hourInDay = dayjs(box.updatedOn.seconds * 1000).format("YYYYMMDDHH");
						processedByDayHour[hourInDay] = processedByDayHour[hourInDay] || [];
						processedByDayHour[hourInDay].push(box);
					}
				});
				return processedByDayHour;
			});

			return {
				dayjs,
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
				processedBoxesPerHour,
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
	h2,
	h3 {
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
