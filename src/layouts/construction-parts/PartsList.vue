<template>
	<BasePage title="Wagenonderdelen">
		<div>
			<BoxesList gap="8px">
				<transition-group name="trans-list">
					<BoxListViewItem
						v-for="item in data"
						:key="item.id"
						:title="item.data.name"
						:sub="`${calculatePercentage(item)}% afgerond`"
						:onEdit="
							() => {
								onEdit(item);
							}
						"
					/>
				</transition-group>
				<Button to="/parts/create" look="green" title="Wagenonderdeel toevoegen"></Button>
			</BoxesList>
		</div>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
	import { useRouter } from "vue-router";
	import { ref, onMounted } from "vue";
	import { fetchAll } from "@/api/constructionParts.js";

	export default {
		components: {
			BasePage,
			BoxListViewItem,
			BoxesList,
			Button,
		},
		setup() {
			const router = useRouter();

			// Get constructionParts
			const data = ref([]);
			const getAll = async () => {
				data.value = await fetchAll();
			};

			onMounted(getAll);
			function onEdit(item) {
				router.push({ name: "parts-edit", params: { id: item.id } });
			}

			function calculatePercentage(item) {
				const calculated = item.data.calculatedTotalAmountFlowers;
				const processed = item.data.processedTotalAmountFlowers;
				return parseInt(processed/calculated * 100)
			}

			return {
				data,
				onEdit,
				calculatePercentage
			};
		},
	};
</script>
