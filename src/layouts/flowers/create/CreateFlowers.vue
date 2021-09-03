<template>
	<BasePage :title="`Dahlia ${routeId ? 'bewerken' : 'toevoegen' }`">
		<div>
			<div v-if="isLoading">Laden...</div>
			<form class="form" @submit.prevent="handleSubmit(flowerId, flower)" v-if="!isLoading">
				<FormInput label="Bloem ID" placeholder="1100" v-model:value="flowerId" />
				<FormInput label="Naam bloem" placeholder="White Aster" v-model:value="flower.name" />
				<FormInput label="Aantal per krat" placeholder="400" v-model:value="flower.boxAmount" :disabled="routeId" />
				<FormInput label="Kleurcode" placeholder="#fff" v-model:value="flower.colorHex" />
				<Button type="submit" title="Opslaan" />
			</form>
		</div>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Button from "@/components/base/Button.vue";
	import FormInput from "@/components/base/form/FormInput.vue";
	import { useRoute, useRouter} from "vue-router";
	import { ref, watch, onMounted } from "vue";
	import { fetchSingleFlowerType, setFlowerType } from "@/api/flowerTypes.js";

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
				boxAmount: 400,
				colorHex: null,
			});

			// Get data (if id specified in route)
			const getAll = async (id) => {
				flower.value = await fetchSingleFlowerType(id).then((response) => {isLoading.value = false; return response});
			};

			if (routeId) {
				isLoading.value = true;
				flowerId.value = routeId;
				onMounted(() => getAll(routeId));

				watch(
					() => route.params.id,
					(newId) => {
						getAll(newId);
					},
				);
			}

			const handleSubmit = (flwId, flower) => {
				setFlowerType(flwId, flower).then(() => {
					router.go(-1)
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
