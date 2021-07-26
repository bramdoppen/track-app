<template>
	<div class="list" :style="{ '--gap': gap }">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: {
			gap: {
				type: String,
				default: "20px",
			},
		},
	};
</script>

<style scoped>
	.list {
		--gap: 20px;
		display: flex;
		flex-direction: column;

		&:deep( > * + *){
			margin-top: var(--gap);
		}
	}
</style>
