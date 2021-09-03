<template>
	<BasePage title="Alle Kratten">
		<transition name="fade" mode="out-in" appear>
			<BoxesList gap="8px" v-if="!ui.loading && !ui.error">
				<transition-group name="trans-list">
					<BoxListViewItem
						v-for="item in data"
						:class="{ inactive: item.data.state > 4 }"
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
			<div class="loading-panel error" v-else-if="ui.error && !ui.loading">
				<div style="padding: 20px;">Er is een error opgetreden bij het laden.</div>
				<Button @click="refresh()" look="green" title="Opnieuw laden" style="margin-top: 20px;"></Button>
			</div>
			<div class="loading-panel" v-else-if="ui.loading && !ui.error">
				<div style="padding: 20px;">Laden...</div>
			</div>
		</transition>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Button from "@/components/base/Button.vue";

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
			Button,
			BoxListViewItem,
			BoxesList,
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			const ui = reactive({
				loading: true,
				error: null,
			});

			// Get all boxes
			const data = ref([]);
			const getAll = async () => {
				ui.loading = true;
				try {
					data.value = await fetchAllBoxes();
				} catch (err) {
					ui.error = err;
				} finally {
					ui.loading = false;
				}
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
				places: store.state.places,
				refresh: getAll,
			};
		},
	};
</script>

<style>
	.inactive {
		opacity: 0.5;
	}
</style>
