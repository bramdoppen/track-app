<template>
  <BasePage title="Inzicht">
    Test
		<BoxesPerStatus :rawBoxes="rawBoxes" :state="1"></BoxesPerStatus>

  </BasePage>
</template>


<script>
	import { ref } from "vue";
	import { db } from "@/functions/firebaseConfig.js";
	import BasePage from "@/layouts/BasePage.vue";
	import BoxesPerStatus from "@/components/charts/BoxesPerStatus.vue";
	import { useStore } from "vuex";

	export default {
		components: {
			BasePage,
			BoxesPerStatus,
		},
		setup() {
			const store = useStore();
			const rawBoxes = ref([]);
			// const constructionParts = ref([]);

			function getAll() {
				console.log(store.state.corsoGroup.id)
				db.collection("boxes")
					.where("belongsToCorsoGroup.id", "==", store.state.corsoGroup.id)
					.onSnapshot(function(querySnapshot) {
						rawBoxes.value = [];
						querySnapshot.forEach(function(doc) {
							rawBoxes.value.push({ id: doc.id, data: doc.data() });
						});
					});

				// db.collection("constructionParts")
				// 	.where("belongsToCorsoGroup.id", "==", store.state.corsoGroup.id)
				// 	.where("isActive", "==", true)
				// 	.get()
				// 	.then((querySnapshot) => {
				// 		constructionParts.value= [];
				// 		querySnapshot.forEach((doc) => {
				// 			constructionParts.value.push({ id: doc.id, data: doc.data() });
				// 		});
				// 	});
			}
			getAll()
			return {
				rawBoxes
			}
		}
	};
</script>