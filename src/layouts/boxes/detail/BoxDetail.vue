<template>
	<BasePage title="Krat detail">
		<div class="loading" v-if="ui.loading">
			Laden...
		</div>
		<div class="faketable-table" v-if="!ui.loading && data">
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Bloemsoort:</span>
				</div>
				<div class="faketable-content">
					<div>{{ data.flowerType.id }} - {{ data.flowerType.name }} ({{ data.flowerType.boxAmount }} per krat)</div>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Krat-ID:</span>
				</div>
				<div class="faketable-content">
					<div>{{ boxId }} </div>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Bloemen in krat:</span>
				</div>
				<div class="faketable-content">
					<div>{{ data.amountInBox }} </div>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Huidige status:</span>
				</div>
				<div class="faketable-content">
					{{ places[data.state] }}
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Huidig wagenonderdeel:</span>
				</div>
				<div class="faketable-content">
					<span v-if="!data.belongsToConstructionPart">-</span>
					<span v-if="data.belongsToConstructionPart">{{ data.belongsToConstructionPart.name }}</span>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Corsogroep:</span>
				</div>
				<div class="faketable-content">
					{{ data.belongsToCorsoGroup.name }}
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Aangemaakt:</span>
				</div>
				<div class="faketable-content">
					<span>{{ dayjs(data.createdOn.seconds * 1000).format("ddd DD MMM YYYY, HH:mm uur") }}</span
					><br />
					<span>Door: {{ data.createdBy.name }}</span>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Laatste update:</span>
				</div>
				<div class="faketable-content" v-if="data.updatedBy && data.updatedOn">
					<span>{{ dayjs(data.updatedOn.seconds * 1000).format("ddd DD MMM YYYY, HH:mm uur") }}</span
					><br />
					<span>Door: {{ data.updatedBy.name }}</span>
				</div>
				<div class="faketable-content" v-if="!data.updatedBy || !data.updatedOn">
					<span>-</span>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Logboek:</span>
				</div>
				<div class="faketable-content" v-if="data.updateLog" style="margin-top: 10px;">
					<div class="faketable-row logboek-item" v-for="(log, logIndex) in data.updateLog" :key="logIndex">
						<span class="logboek-timestamp">{{ dayjs.unix(log.updatedOn.seconds).format("ddd DD MMM YYYY, HH:mm uur") }}</span>
						<span class="logboek-user">{{ log.updatedBy.name }}</span>
						<span class="logboek-message">{{ log.message }}</span>
					</div>
				</div>
			</div>
		</div>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import { useStore } from "vuex";
	import { useRoute } from "vue-router";
	import { ref, reactive, watch, onMounted } from "vue";
	import { fetchSingleBox } from "@/api/boxes.js";
	import dayjs from "dayjs";
	import Calendar from "dayjs/plugin/calendar";
	dayjs.extend(Calendar);

	export default {
		components: {
			BasePage,
		},
		setup() {
			const store = useStore();
			const route = useRoute();
			const ui = reactive({
				loading: true,
			});

			// Get flowerTypes
			const data = ref(null);
			const getAll = async (id) => {
				ui.loading = true;
				data.value = await fetchSingleBox(id).finally((response) => {
					ui.loading = false;
					return response;
				});
			};

			onMounted(() => getAll(route.params.id));

			watch(
				() => route.params.id,
				(newId) => {
					getAll(newId);
				},
			);

			return {
				ui,
				boxId: route.params.id,
				data,
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
	input,
	select {
		padding: 8px 12px;
		outline: 0;
		border: 1px solid #dedede;
		border-radius: 5px;
		width: 100%;
		font-size: 16px !important;
		appearance: none;
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
