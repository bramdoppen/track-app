<template>
	<BasePage :title="singlePart ? singlePart.name : 'Detail onderdeel'">
		<transition name="fade" mode="out-in" appear>
			<div v-if="singlePart" class="container">
				<BoxesList gap="20px">
					<BoxesList>
						<div class="box-holder">
							<BoxListViewItem :title="`${calculatedPercentage}%`" sub="afgerond" />
							<BoxListViewItem :title="`${singlePart.processedTotalAmountFlowers} &#127804;`" sub="verwerkt" />
							<BoxListViewItem :title="`${singlePart.correctionTotalAmountBoxes} &#128230;`" sub="tekort" />
						</div>
						<span style="text-align: center; font-size: 0.8em; max-width: 90%; margin: 0 auto 20px;">{{ singlePart.description }}</span>
					</BoxesList>
					<BoxesList gap="8px">
						<h2>Kratten</h2>
						<span style="text-align: center; font-size: 0.8em; margin-bottom: 20px;">Overzicht geeft per dahliasoort aan hoeveel kratten besteld, binnen en al verwerkt zijn.</span>
						<table class="tableone">
							<tr>
								<th>Bloem</th>
								<th>CA</th>
								<th style="border-right:1px solid black;">TK</th>
								<th>AT</th>
								<th>VW</th>
							</tr>
							<tr v-for="(totalTable, idx) in tables.total" :key="idx">
								<td>{{ totalTable.flowerId }} - {{ totalTable.flowerName }}</td>
								<td>{{ totalTable.calculated }}</td>
								<td style="border-right:1px solid black;">{{ totalTable.correction }}</td>
								<td>{{ totalTable.assigned }}</td>
								<td>{{ totalTable.processed.toFixed(1) }}</td>
							</tr>
						</table>

						<div style="margin-top: 10px; font-size: 10px; font-style: italic;">
							CA = Berekend;<br />
							TK = Tekort; <br />AT = Kratten bij onderdeel; <br />VW = Verwerkte aantal kratten (aant. bloemen uit krat gebruikt);
						</div>
						<hr style="border-color: #ddd; border-top: 0; width: 100%; margin: 10px 0;" />
						<BoxListViewItem
							title="Berekende kratten"
							:sub="`${singlePart.calculatedTotalAmountBoxes} krat (${singlePart.calculatedTotalAmountFlowers} dahlia's)`"
							:onEdit="() => onAddingFlowerChange('calculated')"
						/>
						<BoxListViewItem
							title="Onvoorzien kratten"
							:sub="`${singlePart.correctionTotalAmountBoxes} krat (${singlePart.correctionTotalAmountFlowers} dahlia's)`"
							:onEdit="() => onAddingFlowerChange('correction')"
						/>
						<hr style="border-color: #ddd; border-top: 0; width: 100%; margin: 10px 0;" />
						<BoxListViewItem title="Onderdeel afgerond?" :sub="singlePart.isCompleted ? 'Ja' : 'Nee'" onEditText="Afronden" :onEdit="() => handleCompletePart(singlePart.id)" />
					</BoxesList>
					<BoxesList gap="8px">
						<h2>Toegewezen aan onderdeel ({{ singlePart.assignedBoxes.length }} &#128230;):</h2>
						<span style="text-align: center; font-size: 0.8em; margin-bottom: 20px;">Dit zijn de kratten dit op dit moment bij dit onderdeel staan.</span>
						<table class="tableone">
							<tr>
								<th style="width:0;">ID</th>
								<th>Bloem</th>
								<th>AIK</th>
							</tr>
							<tr v-for="(assigned, idx) in singlePart.assignedBoxes" :key="idx">
								<td style="font-size:12px; font-weight:600;width:0;">
									<router-link :to="`/boxes/detail/${assigned.id}`" style="color:inherit;">{{ assigned.id }}</router-link>
								</td>
								<td style="font-size:12px; max-width: 100px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
									<div style="display: flex; align-items: center;">
										<span class="color-bol" :style="{ background: assigned.flowerType.colorHex }"></span>{{ assigned.flowerType.id }} - {{ assigned.flowerType.name }}
									</div>
								</td>
								<td style="font-size:12px;">{{ assigned.amountInBox }}</td>
							</tr>
						</table>

						<div style="margin-top: 10px; font-size: 10px; font-style: italic;">AIK = Aantal bloemen nog in krat;</div>
					</BoxesList>
					<BoxesList gap="8px">
						<h2>Verwerkt op onderdeel ({{ singlePart.processedBoxes.length }} &#128230;):</h2>
						<span style="text-align: center; font-size: 0.8em; margin-bottom: 20px;"
							>De kratten die op dit onderdeel verwerkt zijn. <br />Per krat zie je hoeveel bloemen uit die krat gebruikt zijn.</span
						>
						<table class="tableone">
							<tr>
								<th style="width:0;">ID</th>
								<th>Bloem</th>
								<th>USED</th>
							</tr>
							<tr v-for="(processed, idx) in singlePart.processedBoxes" :key="idx">
								<td style="font-size:12px; font-weight:600;width:0;">
									<router-link :to="`/boxes/detail/${processed.id}`" style="color:inherit;">{{ processed.id }}</router-link>
								</td>
								<td style="font-size:12px; max-width: 100px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
									<div style="display: flex; align-items: center;">
										<span class="color-bol" :style="{ background: processed.flowerType.colorHex }"></span>{{ processed.flowerType.id }} - {{ processed.flowerType.name }}
									</div>
								</td>
								<td style="font-size:12px;">
									<span :style="{ 'font-weight': processed.usedFromBox !== processed.flowerType.boxAmount ? '600' : ' 400' }">{{ processed.usedFromBox }} </span>
								</td>
							</tr>
						</table>

						<div style="margin-top: 10px; font-size: 10px; font-style: italic;">USED = Aantal uit krat gebruikt op onderdeel</div>
					</BoxesList>
				</BoxesList>
				<div class="faketable-table" style="margin-top:40px">
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Afronding:</span>
						</div>
						<div class="faketable-content">
							<div>
								{{ calculatedPercentage }}% afgerond
								<strong style="font-size: 12px; font-style: italic;" v-if="singlePart.correctionTotalAmountFlowers"
									>Tekort: {{ singlePart.correctionTotalAmountFlowers }} dahlia's</strong
								>
							</div>
							<span style="font-size: 10px; font-style: italic;">Berekening: (Verwerkt / (Berekend + Tekort)) * 100</span>
						</div>
					</div>
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Aangemaakt:</span>
						</div>
						<div class="faketable-content">
							<span>{{ dayjs(singlePart.createdOn.seconds * 1000).format("ddd DD MMM YYYY, HH:mm uur") }}</span
							><br />
							<span>Door: {{ singlePart.createdBy.name }}</span>
						</div>
					</div>
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Laatste update:</span>
						</div>
						<div class="faketable-content" v-if="singlePart.updatedBy && singlePart.updatedOn">
							<span>{{ dayjs(singlePart.updatedOn.seconds * 1000).format("ddd DD MMM YYYY, HH:mm uur") }}</span
							><br />
							<span>Door: {{ singlePart.updatedBy.name }}</span>
						</div>
						<div class="faketable-content" v-if="!singlePart.updatedBy || !singlePart.updatedOn">
							<span>-</span>
						</div>
					</div>
				</div>
			</div>
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
	import { watch, reactive, ref, computed } from "vue";
	import { useStore } from "vuex";
	import { useRoute, useRouter } from "vue-router";
	import { db } from "@/functions/firebaseConfig.js";
	import { completePart } from "@/api/constructionParts";
	import usePercentageCompleted from "@/composables/usePercentageCompleted";

	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";
	import dayjs from "dayjs";

	export default {
		components: {
			BasePage,
			BoxListViewItem,
			BoxesList,
		},
		setup() {
			const store = useStore();
			const route = useRoute();
			const router = useRouter();
			const routeId = route.params.id;

			const tables = reactive({
				total: [],
			});

			const singlePart = useFirestore(db.collection("constructionParts").doc(routeId));
			const { calculatedPercentage } = usePercentageCompleted(singlePart);

			watch(
				() => singlePart.value,
				() => {
					singlePart.value.assignedBoxes.forEach((box) => {
						const idx = tables.total.findIndex((item) => item.flowerId === box.flowerType.id);
						const emptyObj = {
							calculated: 0,
							processed: 0,
							correction: 0,
							assigned: 1,
							flowerId: box.flowerType.id,
							flowerName: box.flowerType.name,
						};
						if (idx >= 0) {
							tables.total[idx].assigned += box.amountInBox / box.flowerType.boxAmount;
						} else {
							tables.total.push(emptyObj);
						}
					});
					singlePart.value.calculatedFlowers.forEach((box) => {
						const idx = tables.total.findIndex((item) => item.flowerId === box.id);
						const emptyObj = {
							calculated: parseFloat(box.calculatedBoxes),
							processed: 0,
							correction: 0,
							assigned: 0,
							flowerId: box.id,
							flowerName: box.name,
						};
						if (idx >= 0) {
							tables.total[idx].calculated += parseFloat(box.calculatedBoxes);
						} else {
							tables.total.push(emptyObj);
						}
					});
					singlePart.value.correctionFlowers.forEach((box) => {
						const idx = tables.total.findIndex((item) => item.flowerId === box.id);
						const emptyObj = {
							calculated: 0,
							processed: 0,
							correction: parseFloat(box.calculatedBoxes),
							assigned: 0,
							flowerId: box.id,
							flowerName: box.name,
						};
						if (idx >= 0) {
							tables.total[idx].correction += parseFloat(box.calculatedBoxes);
						} else {
							tables.total.push(emptyObj);
						}
					});
					singlePart.value.processedBoxes.forEach((box) => {
						const idx = tables.total.findIndex((item) => item.flowerId === box.flowerType.id);
						const emptyObj = {
							calculated: 0,
							processed: 1,
							correction: 0,
							assigned: 0,
							flowerId: box.flowerType.id,
							flowerName: box.flowerType.name,
						};
						if (idx >= 0) {
							tables.total[idx].processed += box.usedFromBox / box.flowerType.boxAmount;
						} else {
							tables.total.push(emptyObj);
						}
					});
				},
			);

			const user = ref(store.state.user);

			return {
				tables,
				singlePart,
				calculatedPercentage,
				dayjs,
				places: store.state.places,
				handleCompletePart: (partId) => {
					if (window.confirm("Wil je dit wagenonderdeel afronden?")) {
						completePart(partId);
					}
				},
				onAddingFlowerChange: (type) => {
					router.push({ path: `/parts/edit/${singlePart.value.id}`, query: { manage: type } });
				},
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

<style scoped>
	h5 {
		font-family: var(--font-title);
		font-weight: 600;
		font-size: 16px;
		margin: 0;
		color: var(--color-dark);
	}
	table,
	th,
	td,
	tr {
		padding: 0;
	}

	.td-flex {
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
		& > span > span:first-child {
			display: inline-block;
			margin-right: 10px;
		}
	}
	.parts-header {
		display: flex;
		align-items: center;
		min-height: 60px;
	}
	.parts-panel {
	}
	.parts-item {
		padding: 10px 0;
		&:not(:last-child) {
			border-bottom: 1px solid gray;
		}
	}
	.fakelink {
		display: inline-flex;
		background: #ececec;
		padding: 8px 20px;
		width: auto;
		border-radius: 5px;
		font-weight: 600;
	}
	.faketable-row {
		margin-bottom: 20px;
	}
	.faketable-table {
		display: flex;
		flex-direction: column;
	}
	.faketable-head {
		font-weight: 600;
	}
	.logboek-item {
		display: grid;
		border-radius: 10px;
		margin-left: 30px;
		background: #f9f9f9;
		padding: 20px;
		grid-template-areas: "timestamp user" "message message";
		grid-template-columns: minmax(0, 1fr) auto;
		position: relative;
		gap: 4px;
		&::after {
			content: "";
			display: block;
			width: 12px;
			height: 12px;
			background: #fff;
			border: 2px solid var(--color-primary);
			border-radius: 50%;
			position: absolute;
			top: 20px;
			left: -30px;
		}
		&::before {
			content: "";
			display: block;
			width: 35px;
			height: calc(100% + 20px);
			background: transparent;
			position: absolute;
			top: 27px;
			left: -23px;
			border-top: 2px dashed #d0d0d0;
			border-left: 2px dashed #d0d0d0;
			z-index: -1;
		}
		&:last-of-type::before {
			border-left: 0;
		}
		&:last-of-type::after {
			background: var(--color-primary);
		}
	}
	.logboek-timestamp {
		grid-area: timestamp;
		font-size: 12px;
		font-family: var(--font-title);
	}
	.logboek-user {
		grid-area: user;
		font-size: 12px;
		font-weight: 200;
		font-family: var(--font-title);
	}
	.logboek-message {
		grid-area: message;
		font-size: 14px;
		font-family: var(--font-title);
		font-weight: 600;
	}

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
	.color-bol {
		width: 10px;
		height: 10px;
		flex: 0 0 auto;
		border: 1px solid gray;
		display: block;
		margin-right: 6px;
		border-radius: 50%;
	}
</style>
