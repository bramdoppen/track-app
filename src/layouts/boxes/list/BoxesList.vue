<template>
	<BasePage title="Alle Kratten">
		<div>
			<div class="loading" v-if="ui.loading">
				Laden...
			</div>
			<BoxesList gap="8px" v-if="!ui.loading && data">
				<transition-group name="trans-list">
					<BoxListViewItem
						v-for="item in data"
						:class="{'inactive': item.data.state > 4}"
						:key="item.id"
						:title="`${item.data.flowerType.id} - ${item.data.flowerType.name}`"
						:sub="`${item.id} | ${places[item.data.state]} | ${dayjs(new Date(item.data.createdOn.seconds * 1000)).fromNow()}`"
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
	import dayjs from "dayjs";
	import FromNow from "dayjs/plugin/relativeTime";
	dayjs.extend(FromNow);

	import { useStore } from "vuex";
	import { useRouter } from "vue-router";

	import { reactive, ref, onMounted } from "vue";
	import { fetchAllBoxes } from "@/api/boxes.js";

	export default {
		components: {
			BasePage,
			BoxListViewItem,
			BoxesList,
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			const ui = reactive({
				loading: true,
			});

			// Get flowerTypes
			const data = ref([]);
			const getAll = async () => {
				ui.loading = true;
				data.value = await fetchAllBoxes().finally((response) => {
					ui.loading = false;
					return response;
				});
			};

			onMounted(getAll);
			function onEdit(item) {
				router.push({ name: "boxes-detail", params: { id: item.id } });
			}

			return {
				ui,
				data,
				dayjs,
				onEdit,
				places: store.state.places
			};
		},
	};
</script>

<style>
.inactive {
	opacity: 0.5;
}

</style>