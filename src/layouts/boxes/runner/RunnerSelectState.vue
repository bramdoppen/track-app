<template>
	<BasePage title="Runnermodus">
		<BoxesList>
			<Box v-if="place != 3">
				<h3>Batch scan</h3>
				<p>Kies een locatie om één of meerdere kratten in te checken.</p>
				<BoxesList gap="12px" style="margin-top: 20px;">
					<Button v-for="(place, idx) in places" :key="idx" look="green" :title="place" @click="setPlace(idx)"></Button>
				</BoxesList>
			</Box>
			<Box v-if="place == 3">
				<h3>Kies een wagenonderdeel</h3>
				<p>Hang deze krat aan een specifiek wagenonderdeel</p>
				<BoxesList gap="8px">
					<Button v-for="(part, idx) in constructionParts" :key="idx" look="green" :title="part.data.name" @click="setConstructionPart(part.id, part.data.name)"></Button>
				</BoxesList>
			</Box>
		</BoxesList>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Box from "@/components/base/Box.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
	import { ref, computed, onMounted } from "vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import { fetchAll } from "@/api/constructionParts.js";


	export default {
		components: {
			BasePage,
			Box,
			BoxesList,
			Button,
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			const _place = ref();
	
			// Get constructionParts
			const constructionParts = ref([]);
			const getAll = async () => {
				constructionParts.value = await fetchAll();
			};

			onMounted(getAll);

			function setPlace(place) {
				_place.value = place;
				store.commit("changeCurrentAction", place);
				if (place != 3) {
					router.push("/boxes/scan");
				}
			}

			function setConstructionPart(id, name) {
				store.commit("changeConstructionPart", { id: id, name: name });
				router.push("/boxes/scan");
			}
			const places = computed(() => store.state.places);
			delete places.value[6];

			return {
				place: _place,
				places,
        constructionParts,
				setPlace,
				setConstructionPart,
			};
		},
	};
</script>

<style scoped>
	.desktop-only {
		@media (max-width: 48em) {
			display: none;
		}
	}
</style>
