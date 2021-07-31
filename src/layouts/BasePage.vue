<template>
	<div class="page" :class="{'s-translucent': translucent}">
		<PageHeader class="page-header" :translucent="translucent" :title="title" />
		<main class="main">
			<slot></slot>
		</main>
		<BottomBar v-if="!hideBottomBar"/>
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
			translucent: {
				type: Boolean,
				default: false,
			},
			hideBottomBar: {
				type: Boolean,
				default: false,
			}
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
		&.s-translucent, &.s-translucent > .main {
			background: #000;
		}
	}
	.page-header {
		z-index: 1;
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
