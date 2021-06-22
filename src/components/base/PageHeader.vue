<template>
	<header>
		<h1>{{ title }}</h1>
	</header>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
			},
		},
	};
</script>

<style scoped>
	.header {
		height: 80px;
	}
</style>
