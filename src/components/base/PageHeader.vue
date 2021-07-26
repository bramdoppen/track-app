<template>
	<header class="header">
		<div class="button-container">
			<Button look="square gray" icon="arrow" iconSize="sm" v-if="showBackButton" @click="prevPage" />
		</div>
		<div class="text-holder">
			<h1>{{ title }}</h1>
		</div>
		<div class="button-container"></div>
	</header>
</template>

<script>
	import Button from "@/components/base/Button";
  import { computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

	export default {
		components: {
			Button,
		},

		props: {
			title: {
				type: String,
			},
		},

		setup() {
      const route = useRoute();
      const router = useRouter();

			const showBackButton = computed(() => {
        return route.path.split("/").length > 2;
      })

      const prevPage = () => {
        router.go(-1);
      };

			return {
        prevPage,
				showBackButton,
			};
		},
	};
</script>

<style scoped>
	.header {
		padding: 10px var(--p-side);
		height: 65px;
		
		background: #fff;
    border-bottom: 1px solid #e4e4e4;
		font-size: 20px;
		display: grid;
		grid-template-columns: 30px 1fr 30px;
		align-items: center;
		gap: var(--p-side);
		/* position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 10; */

		& h1 {
			font-size: inherit;
		}
	}
  .text-holder {
    text-align: center;
  }
</style>
