<template>
	<BasePage title="Wagenonderdelen">
		<transition name="fade" mode="out-in" appear>
			<BoxesList gap="8px" v-if="!ui.loading && !ui.error">
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
	import BoxListViewItem from "@/components/base/BoxListViewItem.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
	import { useRouter } from "vue-router";
	import { ref, onMounted, reactive } from "vue";
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

			const ui = reactive({
				loading: true,
				error: null,
			});
			// Get constructionParts
			const data = ref([]);
			const getAll = async () => {
				ui.loading = true;
				try {
					data.value = await fetchAll();
				} catch (err) {
					ui.error = err;
				} finally {
					ui.loading = false;
				}
			};

			onMounted(getAll);
			function onEdit(item) {
				router.push({ name: "parts-edit", params: { id: item.id } });
			}

			function calculatePercentage(item) {
				const calculated = item.data.calculatedTotalAmountFlowers;
				const processed = item.data.processedTotalAmountFlowers;
				return parseInt((processed / calculated) * 100);
			}

			return {
				ui,
				data,
				onEdit,
				calculatePercentage,
				refresh: getAll,
			};
		},
	};
</script>
