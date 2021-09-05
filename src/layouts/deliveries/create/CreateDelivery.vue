<template>
	<BasePage :title="`Levering ${routeId ? 'bewerken' : 'toevoegen'}`">
		<div>
			<div v-if="isLoading">Laden...</div>
			<form class="form" @submit.prevent="handleSubmit(flowerId, flower)" v-if="!isLoading">
				<FormInput label="Bloem ID" placeholder="1100" :value="flowerId" type="number" disabled />
				<FormInput label="Naam bloem" placeholder="White Aster" :value="flower.name" disabled />
				<FormInput label="Levering / bestelde kratten" placeholder="Aantal kratten besteld" v-model:value="flower.orderedAmount" type="number" />
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
	import { db } from "@/functions/firebaseConfig.js";

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
				orderedAmount: 0,
			});

			// Get data (if id specified in route)
			const getAll = async (id) => {
				flower.value = await fetchSingleFlowerType(id).then((response) => {
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
						orderedAmount: flower.value.orderedAmount,
					});
			};

			const handleSubmit = (flwId) => {
        if(flower.value.orderedAmount) {
          setDeliveryOnFlowerType(flwId).then(() => {
            router.push({ name: "deliveries-list" })
          });
        } else {
          router.push({ name: "deliveries-list" })
        }
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
