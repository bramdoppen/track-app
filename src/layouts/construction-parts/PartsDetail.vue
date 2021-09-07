<template>
	<BasePage :title="singlePart ? singlePart.name : 'Detail onderdeel'">
		<div class="faketable-table" v-if="singlePart">
			<div class="box-holder">
				<BoxListViewItem :title="`${calculatedPercentage}%`" sub="afgerond" />
				<BoxListViewItem :title="`${singlePart.correctionTotalAmountFlowers} &#128230;`" sub="tekort" />
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Omschrijving:</span>
				</div>
				<div class="faketable-content">
					<div>{{ singlePart.description }}</div>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Afronding:</span>
				</div>
				<div class="faketable-content">
					<div>
						{{ calculatedPercentage }}% afgerond
						<strong style="font-size: 12px; font-style: italic;" v-if="singlePart.correctionTotalAmountFlowers">Tekort: {{ singlePart.correctionTotalAmountFlowers }} dahlia's</strong>
					</div>
					<span style="font-size: 10px; font-style: italic;">Berekening: (Verwerkt / (Berekend + Tekort)) * 100</span>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Onderdeel afgerond?:</span>
				</div>
				<div class="faketable-content">
					<div>Nee</div>
					<Button type="button" title="Onderdeel afronden" />
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Tekort beheren:</span>
				</div>
				<div class="faketable-content">
					<Button type="button" title="Tekort beheren" />
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Kratten (Berekend: {{ singlePart.calculatedTotalAmountBoxes }} kratten):</span>
				</div>
				<div class="faketable-content">
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
							<td>{{ totalTable.processed }}</td>
						</tr>
					</table>
					<div style="margin-top: 10px; font-size: 10px; font-style: italic;">CA = Berekend; TK = Tekort; <br>VW = Verwerkt; AT = Kratten bij onderdeel;</div>
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
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Button from "@/components/base/Button.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";

	import { watch, reactive } from "vue";
	import { useStore } from "vuex";
	import { useRoute } from "vue-router";
	import { db } from "@/functions/firebaseConfig.js";
	import usePercentageCompleted from "@/composables/usePercentageCompleted";

	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";
	import dayjs from "dayjs";

	export default {
		components: {
			BasePage,
			Button,
			BoxListViewItem,
		},
		setup() {
			const store = useStore();
			const route = useRoute();
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
							tables.total[idx].assigned += 1;
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
							tables.total[idx].processed += 1;
						} else {
							tables.total.push(emptyObj);
						}
					});
				},
			);

			return {
				tables,
				singlePart,
				calculatedPercentage,
				dayjs,
				places: store.state.places,
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
			text-align: center;
			padding-left: 10px;
			padding-right: 10px;
		}
		& :deep(span.box-sub) {
			font-size: 12px;
		}
	}
</style>
