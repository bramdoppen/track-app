<template>
	<BasePage title="Alle Kratten">
		<div>
			<BoxesList gap="8px">
				<transition-group name="trans-list">
					<BoxListViewItem
						v-for="item in data"
						:key="item.id"
						:title="`${item.data.flowerType.id} - ${item.data.flowerType.name}`"
						:sub="`ID: ${item.id}. State: ${item.data.state}. Created: ${moment(new Date(item.data.createdOn.seconds * 1000)).fromNow()}`"
						:onEdit="
							() => {
								onEdit(item);
							}
						"
					/>
				</transition-group>
			</BoxesList>
		</div>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import moment from "moment";
	import { useRouter } from "vue-router";

	import { ref, onMounted } from "vue";
	import { fetchAllBoxes } from "@/api/boxes.js";

	export default {
		components: {
			BasePage,
			BoxListViewItem,
			BoxesList,
		},
		setup() {
			const router = useRouter();
			// Get flowerTypes
			const data = ref([]);
			const getAll = async () => {
				data.value = await fetchAllBoxes();
			};

			onMounted(getAll);
			function onEdit(item) {
				router.push({ name: "boxes-edit", params: { id: item.id } });
			}
			return {
				data,
				moment,
				momentDate: moment()
					.startOf("day")
					.fromNow(),
				onEdit,
			};
		},
	};
</script>
