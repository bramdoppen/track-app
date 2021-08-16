<template>
	<BasePage title="Wagenonderdelen">
		<div>
			<BoxesList gap="8px">
				<transition-group name="trans-list">
					<BoxListViewItem
						v-for="item in data"
						:key="item.id"
						:title="item.name"
						:sub="item.id"
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
			return {
				data,
				onEdit,
			};
		},
	};
</script>
