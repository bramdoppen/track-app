<template>
	<BasePage title="Onderdeel toevoegen">
		<div>
			<div v-if="isLoading">Laden...</div>
			<form class="form" @submit.prevent="handleSubmit(constructionPart)" v-if="!isLoading">
				<FormInput label="Naam onderdeel" placeholder="Naam onderdeel" v-model:value="constructionPart.name" />
				<FormInput label="Totale oppervlakte (m2)"  placeholder="m2" v-model:value="constructionPart.totalSurface" />
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
	import { fetchSingle, createItem, updateItem } from "@/api/constructionParts.js";

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
			const partId = ref();

			// Get flowerTypes
			const constructionPart = ref({
				name: null,
				totalSurface: null,
			});

			// Get data (if id specified in route)
			const getAll = async (id) => {
				constructionPart.value = await fetchSingle(id).then((response) => {isLoading.value = false; return response});
			};

			if (routeId) {
				isLoading.value = true;
				partId.value = routeId;
				onMounted(() => getAll(routeId));

				watch(
					() => route.params.id,
					(newId) => {
						getAll(newId);
					},
				);
			}

			const handleSubmit = (part) => {
        if(routeId) {
          updateItem(routeId, part).then(() => {
            router.go(-1);
          });
        } else {
          createItem(part).then(() => {
            router.go(-1);
          });
        }
			};

			return {
				constructionPart,
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
