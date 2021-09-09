<template>
	<BasePage :title="`Targets bewerken`">
		<div>
			<div v-if="isLoading">Laden...</div>
			<form class="form" @submit.prevent="handleSubmit()" v-if="!isLoading">
				<div v-for="(targetDay, dayIdx) in targetsPerHour" :key="dayIdx">
					<h2>{{ dayIdx }}</h2>
					<div v-for="(targetHour, hourIdx) in targetDay" :key="`hour-${hourIdx}`">
						<FormInput :label="hourIdx" placeholder="%" v-model:value="targetsPerHour[dayIdx][hourIdx]" type="number" />
					</div>
				</div>
        {{targetsPerHour}}
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
	import { reactive } from "vue";
  import dayjs from "dayjs";
	// import { fetchSingleFlowerType } from "@/api/flowerTypes.js";
	// import { db } from "@/functions/firebaseConfig.js";
  
	export default {
		components: {
			BasePage,
			Button,
			FormInput,
		},
		setup() {
			const route = useRoute();
			const router = useRouter();
			const routeId = route.params.id;
      const isLoading = false;

			// Get flowerTypes
			const targetsPerHour = reactive({
				thursday: {
					19: null,
					20: null,
					21: null,
					22: null,
					23: null,
				},
				friday: {
					9: 10,
					10: null,
					11: null,
					12: null,
					13: null,
					14: null,
					15: null,
					16: null,
					17: null,
					18: null,
					19: null,
					20: null,
					21: null,
					22: null,
					23: null,
					24: null,
				},
				saturday: {
					9: null,
					10: null,
					11: null,
					12: null,
					13: null,
					14: null,
					15: null,
					16: null,
					17: null,
					18: null,
					19: null,
					20: null,
					21: null,
					22: null,
					23: null,
					24: null,
				},
				sunday: {
					1: null,
					2: null,
				},
			});

			// // Get data (if id specified in route)
			// const getAll = async (id) => {
			// 	await fetchSingleFlowerType(id).then((response) => {
			// 		const initialFlower = flower.value;
			// 		flower.value = { ...initialFlower, ...response };
			// 		isLoading.value = false;
			// 		return response;
			// 	});
			// };

			// if (routeId) {
			// 	isLoading.value = true;
			// 	flowerId.value = routeId;
			// 	onMounted(() => getAll(routeId));
			// }

			const saveSingleTarget = () => {
                    // console.log(id, valueKey, value )

        // return;
				// return db
				// 	.collection("flowerTypes")
				// 	.doc(id)
				// 	.set({
				// 		[valueKey]: value,
				// 	});
			};

      const date1 = dayjs('2021-09-09 19:00');
      const date2 = dayjs('2021-09-12 02:00');
      const amountHoursBetween = date2.diff(date1, 'hours');
      const hoursBetween = [];
      for(let i = 0; i <= amountHoursBetween; i++) {
        hoursBetween.push(dayjs(date1).add(i, 'hour'))
      }
      
      console.log(hoursBetween);

      const saveAllTargets = () => {
        const promiseArr = [];
        // console.log(targetsPerHour)
        Object.entries(targetsPerHour).forEach((targetDay, dayIdx) => {
          
          Object.entries(targetDay).forEach((targetHour, hourIdx) => {
            console.log(targetHour)
            saveSingleTarget(dayIdx, hourIdx, targetHour )
          });
        });
        return Promise.all(promiseArr);
      }

			const handleSubmit = () => {
				return saveAllTargets().then(() => {
					router.push({ name: "settings-overview" });
				});
			};

			return {
				routeId,
				targetsPerHour,
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
