<template>
	<svg>
		<use :href="require('@/assets/Icons/icons.svg') + '#' + icon"></use>
	</svg>
</template>

<script>
	export default {
		name: "Icon",
		props: {
			icon: String,
		},
	};
</script>

<style scoped>
	svg {
		width: 26px;
    height: 26px;
		fill: currentColor;
	}
</style>
