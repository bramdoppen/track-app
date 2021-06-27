<template>
  <BasePage title="Nieuwe kratten">
    <div>
      <SearchFlower :result="result" :loading="loading"/>
			{{result}}
    </div>
  </BasePage>
</template>


<script>
	import BasePage from "@/layouts/BasePage.vue";
	import SearchFlower from "@/components/flowers/search/SearchFlower.vue";

	export default {
		components: {
			BasePage,
			SearchFlower,
		},
		data: () => {
			return {
				result: null,
				loading: false,
			}
		}
	};
</script>