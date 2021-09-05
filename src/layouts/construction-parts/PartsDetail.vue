<template>
	<BasePage :title="singlePart ? singlePart.name : 'Detail onderdeel'">
		<div class="faketable-table" v-if="singlePart">
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
					<span>Berekende kratten ({{ singlePart.calculatedTotalAmountBoxes }} kratten):</span>
				</div>
				<div class="faketable-content">
					<table>
						<tr>
							<th>Bloemtype</th>
							<th>Krat</th>
							<th>Dahlia's</th>
						</tr>
						<tr v-for="(calculated, idx) in singlePart.calculatedFlowers" :key="idx">
							<td>{{ calculated.id }} - {{ calculated.name }}</td>
							<td>{{ calculated.calculatedBoxes }}</td>
							<td>{{ calculated.calculatedFlowers }}</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Toegewezen aan onderdeel ({{ singlePart.assignedBoxes.length }} kratten):</span>
				</div>
				<div class="faketable-content">
					<table>
						<tr>
							<th>Bloemtype</th>
							<th>Krat-id</th>
						</tr>
						<tr v-for="(item, idx) in singlePart.assignedBoxes" :key="idx">
							<td>{{ item.flowerType.id }} - {{ item.flowerType.name }}</td>
							<td>{{ item.id }}</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Verwerkt: {{ singlePart.processedTotalAmountFlowers }} dahlias ({{ singlePart.processedBoxes.length }} kratten):</span>
				</div>
				<div class="faketable-content">
					<table>
						<tr>
							<th>Bloemtype</th>
							<th>Krat-id</th>
							<th>Uit krat gebruikt</th>
						</tr>
						<tr v-for="(item, idx) in singlePart.processedBoxes" :key="idx">
							<td>{{ item.flowerType.id }} - {{ item.flowerType.name }}</td>
							<td>{{ item.id }}</td>
							<td>{{ item.usedFromBox }}</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Aangemaakt:</span>
				</div>
				<div class="faketable-content">
					<span>{{ dayjs(singlePart.createdOn.seconds * 1000).calendar() }}</span
					><br />
					<span>Door: {{ singlePart.createdBy.name }}</span>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Laatste update:</span>
				</div>
				<div class="faketable-content" v-if="singlePart.updatedBy && singlePart.updatedOn">
					<span>{{ dayjs(singlePart.updatedOn.seconds * 1000).calendar() }}</span
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
	import { useStore } from "vuex";
	import { useRoute } from "vue-router";
	import { db } from "@/functions/firebaseConfig.js";
	import usePercentageCompleted from "@/composables/usePercentageCompleted";

	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";
	import dayjs from "dayjs";
	import Calendar from "dayjs/plugin/calendar";
	dayjs.extend(Calendar);

	export default {
		components: {
			BasePage,
			Button,
		},
		setup() {
			const store = useStore();
			const route = useRoute();
			const routeId = route.params.id;

			const singlePart = useFirestore(db.collection("constructionParts").doc(routeId));

			const { calculatedPercentage } = usePercentageCompleted(singlePart);

			return {
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
	th {
		text-align: left;
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
</style>
