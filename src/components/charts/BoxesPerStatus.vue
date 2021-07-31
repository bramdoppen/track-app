<template>
	<div>
		<vue3-chart-js ref="chartRef" id="barChart" type="bar" :data="chartData.data" :options="chartData.options"></vue3-chart-js>
	</div>
</template>

<script>
	import { toRefs, ref, watch } from "vue";
	import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

	export default {
		components: {
			Vue3ChartJs,
		},
		props: {
			rawBoxes: {
				type: Array,
				required: true,
			},
			state: {
				type: Number,
				required: true,
			},
		},
		setup(props) {
			const chartRef = ref(null);
			const { rawBoxes, state } = toRefs(props);

			const buildKrattenInMagazijn = (boxes) => {
				const arr = [];
				boxes.forEach((box) => {
					// Check index of existing box
					const existsAtIndex = arr.findIndex((item) => {
						return item.name == box.data.flowerType.name;
					});

					// Find only boxes with a matching state
					if (box.data.state === state.value) {
						if (existsAtIndex == -1) {
							const flowerColor = box.data.flowerType.colorHex || "#000";
							arr.push({
								name: box.data.flowerType.name,
								flowerColor: flowerColor,
								amount: 1,
							});
						} else {
							arr[existsAtIndex].amount += 1;
						}
					}
				});

				return arr;
			};

			const chartData = {
				id: "barchart",
				type: "bar",
				data: {
					labels: [],
					datasets: [
						{
							data: [],
							backgroundColor: [],
						},
					],
				},
				options: {
					indexAxis: "y",
          plugins: {
            legend: {
              display: false,
            }
          }
				},
			};

			function resetData() {
				chartData.data.labels = [];
				chartData.data.datasets[0].data = [];
				chartData.data.datasets[0].backgroundColor = [];
			}

			watch(
				() => rawBoxes.value,
				() => {
					resetData();
					buildKrattenInMagazijn(rawBoxes.value).forEach((item) => {
						chartData.data.labels.push(item.name);
						chartData.data.datasets[0].data.push(item.amount);
						chartData.data.datasets[0].backgroundColor.push(item.flowerColor);
					});

					chartRef.value.update();
				},
			);

			return {
				chartData,
				chartRef,
			};
		},
	};
</script>
