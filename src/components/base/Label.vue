<template>
	<div class="label" :class="state">
    <slot></slot>
	</div>
</template>

<script>
	export default {
		name: "Label",
		props: {
			state: {
				type: String,
			},
		},
	};
</script>

<style scoped>
	.label {
    font-weight: 600;
		padding: 2px 6px;
		display: inline-block;
		font-size: 0.9em;
		border-radius: 3px;
    &.warning {
      background: #ff9800;
      color: white;
    }
	}
</style>
