<template>
	<div>
		<vue3-chart-js ref="chartRef" id="barChart" type="line" :data="chartData.data" :options="chartData.options"></vue3-chart-js>
	</div>
</template>

<script>
	import { toRefs, ref, watch } from "vue";
  import dayjs from "dayjs";
	import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

	export default {
		components: {
			Vue3ChartJs,
		},
		props: {
			rawBoxes: {
				type: Object,
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
		},
		setup(props) {
			const chartRef = ref(null);
			const { rawBoxes, darkMode, largeFont } = toRefs(props);

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
					indexAxis: "x",
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
				if (rawBoxes.value) {
					resetData();
					Object.keys(rawBoxes.value).forEach((key) => {
						chartData.data.labels.push(dayjs(key).format('ddd HHu'));
            const item = rawBoxes.value[key];
						chartData.data.datasets[0].data.push(item.length);
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
