<template>
	<div class="page">
		<PageHeader :title="title" />
		<main class="main">
			<slot></slot>
		</main>
		<BottomBar />
	</div>
</template>

<script>
	import PageHeader from "@/components/base/PageHeader.vue";
	import BottomBar from "@/components/base/BottomBar.vue";

	export default {
		components: {
			PageHeader,
			BottomBar,
		},

		props: {
			title: {
				type: String,
			},
		},
	};
</script>

<style scoped>
	.page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
  .main {
    flex: 1 0 auto;
  }
</style>
