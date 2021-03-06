<template>
	<div class="realtime-grid">
		<div class="realtime-tile">
			<div class="rt-box">
				<h2>In Magazijn</h2>
				<div class="rt-box-chart" v-if="allBoxes && allBoxes.length > 0">
					<BoxesPerStatus :rawBoxes="allBoxes" :state="0" :darkMode="true" :largeFont="true"></BoxesPerStatus>
				</div>
			</div>
		</div>

		<div class="realtime-tile">
			<div class="rt-box">
				<h2>Gespijkerd en klaar voor steiger</h2>
				<div class="rt-box-chart">
					<BoxesPerStatus :rawBoxes="allBoxes" :state="2" :darkMode="true" :largeFont="true"></BoxesPerStatus>
				</div>
			</div>
		</div>
		<div class="realtime-list">
			<div class="rt-box" v-if="routeQuery.screen === 'magazijn'">
				<h2>Op spijkertafel</h2>
				<div class="rt-box-chart">
					<BoxesPerStatus :rawBoxes="allBoxes" :state="1" :horizontal="true" :darkMode="true" :largeFont="true"></BoxesPerStatus>
				</div>
			</div>
			<div class="rt-box" v-else>
				<div class="rt-afronding">
					<h2>Krat afgerond:</h2>
					<span v-if="totalProcessedBoxes">{{ parseInt(totalProcessedBoxes.length) }} &#128230;</span>
					<h2 style="margin-top: 80px;">Indicatie totale afronding:</h2>
					<span v-if="totalCalculated">{{ parseFloat(totalCalculated.percentage).toFixed(1) }}%</span>
				</div>
			</div>
		</div>
		<span class="version">v{{ version }}</span>
	</div>
</template>

<script>
	import { version } from "/package.json";

	import { db } from "@/functions/firebaseConfig.js";
	import { computed } from "vue";
	import { useRoute } from "vue-router";
	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";
	import BoxesPerStatus from "@/components/charts/BoxesPerStatus.vue";
	import useCalculateTotalPercentage from "@/composables/useCalculateTotalPercentage";

	export default {
		components: {
			BoxesPerStatus,
		},
		setup() {
			const route = useRoute();
			const routeQuery = computed(() => route.query);
			const allBoxes = useFirestore(db.collection("boxes"));
			const allParts = useFirestore(db.collection("constructionParts"));

			const totalCalculated = computed(() => {
				if (!allParts.value) {
					return;
				}

				const { calculatedTotal } = useCalculateTotalPercentage(allParts.value);
				return {
					percentage: calculatedTotal.value,
				};
			});
			const totalProcessedBoxes = computed(() => {
				if (!allBoxes.value) {
					return;
				}
				return allBoxes.value.filter((box) => {
					return box.state === 4;
				});
			});
			return {
				totalCalculated,
				totalProcessedBoxes,
				allBoxes,
				version,
				routeQuery,
			};
		},
	};
</script>

<style scoped>
	.realtime-grid {
		--bg: #000;
		--fg: #fff;
		--box-bg: #222;
		--box-fg: #fff;
		/* --bg: #fbfbfb;
		--fg: #000;
		--box-bg: #fff;
		--box-fg: #000; */
		background: var(--bg);
		color: var(--fg);
		display: grid;
		grid-template-columns: minmax(0, 1fr) 500px;
		grid-template-rows: 1fr 1fr;
		gap: 20px;
		padding: 20px;
		height: 100%;
	}
	h2 {
		font-size: clamp(18px, 2vw, 36px);
		margin: 0;
		margin-top: 10px;
		margin-bottom: 20px;
		text-align: center;
		opacity: 0.75;
	}
	.realtime-list {
		grid-column: 2;
		grid-row: 1 / -1;
	}
	.rt-box {
		background: var(--box-bg);
		color: var(--box-fg);
		border-radius: 20px;
		padding: 20px 30px;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		box-shadow: 0px 10px 100px rgb(0 0 0 / 5%);
	}
	.rt-box-chart {
		flex: 1 0 auto;
		& > div {
			height: 100%;
		}
	}
	.rt-afronding {
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 6vw;
		gap: 0.1em;
		font-weight: bold;
		padding-bottom: 30px;
		& > h2 {
			font-size: 0.35em;
			opacity: 0.5;
		}
	}
	.version {
		position: absolute;
		font-size: 12px;
		color: #fff;
		opacity: 0.4;
		right: 5px;
		bottom: 4px;
	}
</style>
