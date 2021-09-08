<template>
	<BasePage title="Nieuwe kratten">
		<div class="hide-on-print grid">
			<div class="krat-zoeken">
				<SearchFlower v-model:result="results" />
				<ul class="resultList">
					<li v-for="(result, idx) in results" :key="idx" class="resultItem">
						<SingleFlowerResult :result="result" v-model:batch="batch" />
					</li>
				</ul>
			</div>
			<div class="krat-printlijst">
				<h2 style="margin-bottom: 10px;">Printlijst:</h2>
				<div class="empty" v-if="batch.length === 0">
					<span>Geen kratten om te printen</span>
				</div>
				<BoxesList class="newBoxGroup" gap="6px">
					<BoxListViewItem
						v-for="(box, index) in batch"
						:key="index"
						:title="`${box.flowerType.id} - ${box.flowerType.name}`"
						:sub="`${box.amount} krat${box.amount !== 1 ? 'ten' : ''}`"
					/>
				</BoxesList>

				<div class="button-holder" style="margin-top: 20px;">
					<Button v-if="batch.length > 0" title="Kratten aanmaken" @click="startPrint()"></Button>
				</div>
			</div>
		</div>
		<PrintLabels v-if="showPrinter && printBatch.length > 0" :boxes="printBatch" :printStarted="onPrintStarted"></PrintLabels>
	</BasePage>
</template>

<script>
	import { ref } from "vue";
	import BasePage from "@/layouts/BasePage.vue";
	import Button from "@/components/base/Button.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";
	import SearchFlower from "@/components/flowers/search/SearchFlower.vue";
	import SingleFlowerResult from "@/components/flowers/search/SingleFlowerResult.vue";
	import PrintLabels from "@/layouts/boxes/create/PrintLabels.vue";

	export default {
		components: {
			BasePage,
			SearchFlower,
			SingleFlowerResult,
			PrintLabels,
			Button,
			BoxesList,
			BoxListViewItem,
		},
		setup() {
			const results = ref([]);
			const batch = ref([]);
			const printBatch = ref([]);
			const showPrinter = ref(false);

			function onPrintStarted() {
				// Empty qrlist when print started
				showPrinter.value = false;
				results.value = [];
				batch.value = [];
				printBatch.value = [];
			}

			function createBoxesArray() {
				batch.value.forEach((box) => {
					for (let i = 0; i < box.amount; i++) {
						const boxToPrint = {...box};
						delete boxToPrint.amount
						printBatch.value.push(boxToPrint);
					}
				});
				console.log(printBatch.value)
			}

			function startPrint() {
				showPrinter.value = true;
				createBoxesArray();
				window.addEventListener(
					"keyup",
					(e) => {
						if (e.keyCode == 27) {
							showPrinter.value = false;
						}
					},
					{ once: true },
				);
			}

			return {
				results,
				batch,
				printBatch,
				showPrinter,
				onPrintStarted,
				startPrint,
			};
		},
	};
</script>

<style scoped>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.resultList {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 20px 60px;
	}

	.fade-enter-active {
		transition: opacity 0.2s;
	}
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>
