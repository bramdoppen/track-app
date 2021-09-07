<template>
	<BasePage :title="`Levering ${routeId ? 'bewerken' : 'toevoegen'}`">
		<div>
			<div v-if="isLoading">Laden...</div>
			<form class="form" @submit.prevent="handleSubmit(flowerId, flower)" v-if="!isLoading">
				<FormInput label="Bloem ID" placeholder="1100" :value="flowerId" type="number" disabled />
				<FormInput label="Naam bloem" placeholder="" :value="flower.name" disabled />
				<hr style="border-color: #ddd; border-top: 0; width: 100%;">
				<FormInput label="Extern besteld" placeholder="Aantal kratten besteld" v-model:value="flower.ordered.external" type="number" step=".1" />
				<FormInput label="Intern: (Van eigen land)" placeholder="Aantal kratten besteld" v-model:value="flower.ordered.internal" type="number" step=".1" />
				<hr style="border-color: #ddd; border-top: 0; width: 100%;">
				<FormInput label="Tekort: (onvoorzien tijdens plakweekend)" placeholder="Aantal kratten besteld" v-model:value="flower.ordered.correction" type="number" step=".1" />
				<Button type="submit" title="Opslaan" />
			</form>
		</div>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Button from "@/components/base/Button.vue";
	import FormInput from "@/components/base/form/FormInput.vue";
	import { useRoute, useRouter } from "vue-router";
	import { ref, onMounted } from "vue";
	import { fetchSingleFlowerType } from "@/api/flowerTypes.js";
	import { fb, db } from "@/functions/firebaseConfig.js";

	export default {
		components: {
			BasePage,
			Button,
			FormInput,
		},
		setup() {
			const isLoading = ref(false);
			const route = useRoute();
			const router = useRouter();
			const routeId = route.params.id;
			const flowerId = ref();

			// Get flowerTypes
			const flower = ref({
				name: null,
				code: null,
				ordered: {
					external: null,
					internal: null,
					correction: null,
				},
			});

			// Get data (if id specified in route)
			const getAll = async (id) => {
				await fetchSingleFlowerType(id).then((response) => {
					const initialFlower = flower.value;
					flower.value = { ...initialFlower, ...response };
					isLoading.value = false;
					return response;
				});
			};

			if (routeId) {
				isLoading.value = true;
				flowerId.value = routeId;
				onMounted(() => getAll(routeId));
			}

			const setDeliveryOnFlowerType = (id) => {
				return db
					.collection("flowerTypes")
					.doc(id)
					.update({
						orderedAmount: fb.firestore.FieldValue.delete(),
						ordered: {
							external: parseFloat(flower.value.ordered.external) || null,
							internal: parseFloat(flower.value.ordered.internal) || null,
							correction: parseFloat(flower.value.ordered.correction) || null,
						},
					});
			};

			const handleSubmit = (flwId) => {
				setDeliveryOnFlowerType(flwId).then(() => {
					router.push({ name: "deliveries-list" });
				});
				
				
			};

			return {
				routeId,
				flower,
				flowerId,
				handleSubmit,
				isLoading,
			};
		},
	};
</script>

<style scoped>
	.form {
		display: flex;
		flex-direction: column;
		text-align: left;
		gap: 15px;
	}
</style>
