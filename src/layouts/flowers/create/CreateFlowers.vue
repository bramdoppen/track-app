<template>
	<BasePage title="Dahlia toevoegen">
		<div>
			<form class="form" @submit.prevent="handleSubmit(flowerId, flower)">
				<FormInput label="Bloem ID" placeholder="1100" v-model:value="flowerId" />
				<FormInput label="Naam bloem" placeholder="White Aster" v-model:value="flower.name" />
				<FormInput label="Aantal per krat" placeholder="400" v-model:value="flower.boxAmount" />
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
	import { ref, toRefs, onMounted } from "vue";
	import { fetchSingleFlowerType, setFlowerType } from "@/api/flowerTypes.js";

	export default {
		components: {
			BasePage,
			Button,
			FormInput,
		},
		props: {
			id: {
				type: String,
				required: false,
			},
		},
		setup(props) {
			const { id } = toRefs(props);
			const flowerId = ref();

			// Get flowerTypes
			const flower = ref({
				name: null,
				code: null,
				boxAmount: 400,
				colorHex: null,
			});

			const getAll = async () => {
				flower.value = await fetchSingleFlowerType(id.value);
			};

			if (id.value) {
				flowerId.value = id.value;
				onMounted(getAll);
			}

			const handleSubmit = (flwId, flower) => {
				setFlowerType(flwId, flower);
			};

			return {
				flower,
				flowerId,
				handleSubmit,
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