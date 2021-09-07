<template>
	<div class="realtime-grid">
		<div class="realtime-tile-grid">
			<div class="realtime-tile">
				<div class="rt-box">
					<h2>In Magazijn</h2>
					<div class="rt-box-chart">
						<BoxesPerStatus :rawBoxes="allBoxes" :state="0"></BoxesPerStatus>
					</div>
				</div>
			</div>
			<div class="realtime-tile">
				<div class="rt-box">
					<h2>Op spijkertafel</h2>
					<div class="rt-box-chart">
						<BoxesPerStatus :rawBoxes="allBoxes" :state="1"></BoxesPerStatus>
					</div>
				</div>
			</div>
		</div>
		<div class="realtime-list">
			<div class="rt-box">
				<h2>Wagenonderdeel</h2>
				<div class="rt-box-chart"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { db } from "@/functions/firebaseConfig.js";
	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";
	import BoxesPerStatus from "@/components/charts/BoxesPerStatus.vue";
	export default {
		components: {
			BoxesPerStatus,
		},
		setup() {
			const allBoxes = useFirestore(db.collection("boxes"));
			return {
				allBoxes,
			};
		},
	};
</script>

<style scoped>
	.realtime-grid {
		/* --bg: #000;
    --fg: #fff;
    --box-bg: #222;
    --box-fg: #fff; */
		--bg: #fbfbfb;
		--fg: #000;
		--box-bg: #fff;
		--box-fg: #000;
		background: var(--bg);
		color: var(--fg);
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 40px;
		padding: 20px;
		height: 100%;
	}
	.realtime-tile-grid {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 20px;
	}
  h2 {
    font-size: 18px;
    margin: 0;
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
</style>
