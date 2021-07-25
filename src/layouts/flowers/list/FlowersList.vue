<template>
	<BasePage title="Alle Dahlia's">
		<div>
      {{data}}
			<BoxesList>
        <BoxListViewItem v-for="item in data" 
          :key="item.id" 
          :title="item.name" 
          :sub="item.id"
          :onEdit="() => {onEdit(item)}"/>
      </BoxesList>
		</div>
    <Button to="/flowers/create" look="green" title="Nieuwe dahlia toevoegen"></Button>

	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
  import BoxListViewItem from "@/components/base/BoxListViewItem.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
	import { ref, onMounted } from "vue";
	import { fetchFlowerTypes } from "@/api/flowerTypes.js";

	export default {
		components: {
			BasePage,
      BoxListViewItem,
      BoxesList,
      Button,
		},
		setup() {
			// Get flowerTypes
			const data = ref([]);
			const getAll = async () => {
				data.value = await fetchFlowerTypes();
			};

			onMounted(getAll);
      function onEdit(flower) {
        console.log(flower)
      }
			return {
				data,
        onEdit
			};
		},
	};
</script>
