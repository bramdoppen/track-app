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
				<BoxesList gap="8px" style="margin-top: 20px;">
					<Button class="set-btn" v-for="(part, idx) in filteredParts.active" :key="idx" look="green" :title="part.name" @click="setConstructionPart(part.id, part.name)"
						><div class="percentage-in-button" :style="{ '--percentage': calculatePercentage(part) + '%' }"></div
					></Button>
				</BoxesList>
				<BoxesList gap="8px" style="margin-top: 30px;" v-if="filteredParts.completed.length > 0">
					<strong style="text-align: center; font-size: 14px; opacity: 0.75;">Afgeronde onderdelen</strong>
					<Button class="set-btn completed" v-for="(part, idx) in filteredParts.completed" :key="idx" look="completed" :title="part.name" @click="setConstructionPart(part.id, part.name)"
						><div class="percentage-in-button" :style="{ '--percentage': calculatePercentage(part) + '%' }"></div
					></Button>
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
	import { ref, computed } from "vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import usePercentageCompleted from "@/composables/usePercentageCompleted";
	import { db } from "@/functions/firebaseConfig.js";
	import { useFirestore } from "@vueuse/firebase/useFirestore.esm";

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

			const allParts = useFirestore(db.collection("constructionParts"));

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

			function calculatePercentage(item) {
				const { calculatedPercentage } = usePercentageCompleted(item);
				return calculatedPercentage.value;
			}

			const filteredParts = computed(() => {
				const obj = {
					active: [],
					completed: [],
				};
				if (Array.isArray(allParts.value)) {
					const arr = [...allParts.value];
					obj.active = arr
						.filter((item) => !item.isCompleted)
						.sort((a, b) => {
							return calculatePercentage(b) - calculatePercentage(a);
						});
					obj.completed = arr.filter((item) => item.isCompleted);
				}
				return obj;
			});
			return {
				place: _place,
				places,
				filteredParts,
				setPlace,
				setConstructionPart,
				calculatePercentage,
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
	.set-btn :deep(> span) {
		z-index: 1;
		position: relative;
	}
	.percentage-in-button {
		background: #00000026;
		width: var(--percentage);
		height: 100%;
		position: absolute;
		left: 0;
		font-size: 9px;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		box-sizing: border-box;
		color: #ffffff91;
	}
</style>
