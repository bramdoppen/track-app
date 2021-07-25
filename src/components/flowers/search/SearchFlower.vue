<template>
	<div class="form-row">
		<div class="form-item">
			<FormInput label="Bloemsoort zoeken" placeholder="Zoek naar een bloemsoort" v-model:value="searchKey" />
		</div>
	</div>
</template>

<script>
	import { ref, onMounted, computed, watch } from "vue";
	import { fetchFlowerTypes } from "@/api/flowerTypes.js";
	import FormInput from "@/components/base/form/FormInput.vue";

	export default {
		name: "SearchFlower",
		props: {
			result: {
				type: Array,
			},
		},
		components: {
			FormInput,
		},
		emits: ["update:result"],
		setup(props, { emit }) {
			// Get flower types
			const flowerTypes = ref([]);
			const getFlowerTypes = async () => {
				flowerTypes.value = await fetchFlowerTypes();
			};
			onMounted(getFlowerTypes);

			const searchKey = ref();
			// Filter results
			const filteredResults = computed(() => {
				if (searchKey.value && searchKey.value.length > 0) {
					return flowerTypes.value.filter((obj) => Object.keys(obj).some((key) => obj[key].toLowerCase().includes(searchKey.value)));
				}
				return [];
			});

      // Watching the filteredresults and emitting them
			watch(filteredResults, (newValue) => {
				emit("update:result", newValue);
			});

			return {
				searchKey,
				flowerTypes,
			};
		},
	};
</script>
