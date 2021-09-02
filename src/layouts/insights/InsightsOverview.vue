<template>
	<BasePage title="Inzicht">
		<BoxesList>
			<div class="box-holder">
			<Box>
				<h3 v-if="data.length > 0">{{ data.length }}</h3>
				<h3 v-else>-</h3>
				<span>&#128230;  verwerkt</span>
			</Box>
			<Box>
				<h3 v-if="data.length > 0">{{ data.length }}</h3>
				<h3 v-else>-</h3>
				<span>Kratten binnen</span>
			</Box>
			</div>
			<Box>
				<h3>Wagenonderdelen</h3>
				{{ data }}
				<p>Beheer verschillende wagenonderdelen</p>
				<Button to="/parts/list" look="green" title="Wagenonderdelen"></Button>
			</Box>
		</BoxesList>

		<BoxesPerStatus :rawBoxes="rawBoxes" :state="1"></BoxesPerStatus>
	</BasePage>
</template>

<script>
	import { ref, reactive, onMounted } from "vue";
	import BasePage from "@/layouts/BasePage.vue";
	import BoxesPerStatus from "@/components/charts/BoxesPerStatus.vue";
	import Box from "@/components/base/Box.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";

	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import { fetchAllBoxes } from "@/api/boxes.js";

	export default {
		components: {
			BasePage,
			BoxesPerStatus,
			BoxesList,
			Box,
			Button,
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
					data.value = await fetchAllBoxes(10, 4).then((response) => {
						return response;
					});
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
				onEdit,
				places: store.state.places,
			};
		},
	};
</script>
