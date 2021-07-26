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
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
		overflow: hidden;
	}
	.main {
		flex: 1 0 auto;
		padding: 20px;
		overflow: auto;
		/* padding-top: 85px; */
		background: #f5f5f5;
	}
	.message {
		background: red;
	}
</style>
