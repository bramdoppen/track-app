<template>
	<div class="f-row">
		<label v-if="label">{{ label }}</label>
		<input :type="type" :placeholder="placeholder" :value="value" @input="$emit('update:value', $event.target.value)" />
	</div>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: "text",
			},
			value: {
				required: true,
			},
			label: {
				type: String,
				required: false,
			},
			placeholder: {
				type: String,
				required: false,
			},
		},
		emits: ["update:value"],
	};
</script>

<style scoped>
	.f-row {
		display: flex;
		flex-direction: column;
		text-align: left;
		gap: 8px;
	}

	label {
		font-weight: 600;
		font-size: 14px;
		font-family: system-ui;
	}

	input,
	select {
		font-family: system-ui;
		padding: 19px 25px;
		font-size: 16px;
		border: 2px solid #eaeaea;
		background: white;
		border-radius: 10px;
		outline: 0;
		transition: border-color 0.2s ease;
	}
	input:focus,
	select:focus {
		border-color: var(--color-secondary);
	}
	.errors {
		color: var(--color-error);
		line-height: 1.4;
	}
</style>
