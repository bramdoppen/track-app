<template>
	<svg :class="size">
		<use :href="require('@/assets/Icons/icons.svg') + '#' + icon"></use>
	</svg>
</template>

<script>
	export default {
		name: "Icon",
		props: {
			icon: {
				type: String,
			},
			size: {
				type: String,
			},
		},
	};
</script>

<style scoped>
	svg {
		--size: 26px;
		width: var(--size);
		height: var(--size);
		fill: currentColor;

		&.sm {
			--size: 16px;
		}
	}
</style>
