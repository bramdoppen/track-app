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
			darkMode: {
				type: Boolean,
				default: false,
			},
			largeFont: {
				type: Boolean,
				default: false,
			},
			horizontal: {
				type: Boolean,
				default: false,
			}
		},
		setup(props) {
			const chartRef = ref(null);
			const { rawBoxes, state, darkMode, largeFont, horizontal } = toRefs(props);

			const buildKrattenInMagazijn = (boxes) => {
				const arr = [];
				boxes.forEach((box) => {
					// Check index of existing box
					const existsAtIndex = arr.findIndex((item) => {
						return item.name == box.flowerType.name;
					});

					// Find only boxes with a matching state
					if (box.state === state.value) {
						if (existsAtIndex == -1) {
							const flowerColor = box.flowerType.colorHex || "#000";
							// const amount = () => {
							// 	console.log(box)
							// 	if(box.amountInBox) {
							// 		return box.amountInBox / box.flowerType.boxAmount
							// 	} else {
							// 		return 1;
							// 	}
							// }
							arr.push({
								name: box.flowerType.name,
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
					indexAxis: horizontal.value ? "y" : "x",
					maintainAspectRatio: false,
					responsive: true,
					borderWidth: 1,
					borderColor: darkMode.value ? "#333" : undefined,
					scales: {
						y: {
							ticks: {
								precision: 0,
								color: darkMode.value ? "#fff" : "#000",
								font: {
									size: largeFont.value ? 16 : undefined,
								},
							},
						},
						x: {
							ticks: {
								color: darkMode.value ? "#fff" : "#000",
								font: {
									size: largeFont.value ? 18 : undefined,
								},
							},
						},
					},
					plugins: {
						legend: {
							display: false,
						},
					},
				},
			};

			function resetData() {
				chartData.data.labels = [];
				chartData.data.datasets[0].data = [];
				chartData.data.datasets[0].backgroundColor = [];
			}

			function buildChart() {
				if (rawBoxes.value && rawBoxes.value.length > 0) {
					resetData();
					buildKrattenInMagazijn(rawBoxes.value).forEach((item) => {
						chartData.data.labels.push(item.name);
						chartData.data.datasets[0].data.push(item.amount);
						chartData.data.datasets[0].backgroundColor.push(item.flowerColor);
					});
					if (chartRef.value) {
						chartRef.value.update();
					}
				}
			}

			watch(
				() => rawBoxes.value,
				() => {
					buildChart();
				},
			);
			buildChart();

			return {
				chartData,
				chartRef,
			};
		},
	};
</script>
