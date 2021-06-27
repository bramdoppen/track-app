<template>
	<button class="button" :class="[type]" v-if="!to" @click="handleClick">
		<span>{{ title }}</span>
		<Icon :icon="icon" :size="iconSize" v-if="icon" />
	</button>
	<router-link class="button" :class="[type]" :to="to" v-if="to">
		<span>{{ title }}</span>
		<Icon :icon="icon" :size="iconSize" v-if="icon" />
	</router-link>
</template>

<script>
	import Icon from "@/components/base/Icon";

	export default {
		name: "Button",

		components: {
			Icon,
		},

		props: {
			title: {
				type: String,
			},
			type: {
				type: String,
			},
			icon: {
				type: String,
			},
			iconSize: {
				type: String,
			},
			to: {
				type: String,
				required: false,
			},
		},
		emits: ["onClick"],
		methods: {
			handleClick() {
				this.$emit("onClick");
			},
		},
	};
</script>

<style scoped>
	.button {
		font-size: var(--fz-base);
		background: var(--color-primary);
		font-family: var(--font-title);
		font-weight: 600;
		color: #fff;
		padding: 22px;
		min-height: 40px;
		border-radius: 8px;
		border: 0;
		appearance: none;
		width: 100%;
		position: relative;
		overflow: hidden;
		cursor: pointer;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		transition: filter 0.2s ease;

		&:hover,
		&:focus {
			filter: brightness(1.1);
		}

		&.small {
			padding: 18px 24px;
		}

		&.tiny {
			border-radius: 15px;
			border: 1px solid currentColor;
			padding: 3px 13px;
			width: auto;
			color: var(--color-dark);
			background: transparent;

			&:hover,
			&:focus {
				filter: brightness(1.8);
			}
		}

		&.gray {
			color: var(--color-dark);
			background: #fff;
		}

		&.square {
			border-radius: 50%;
			padding: 0;
			width: 30px;
			height: 30px;
			min-height: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&.green {
			font-size: 18px;
			background: var(--color-secondary);
			padding: 5px 10px;
			min-height: 50px;
			border-radius: 15px;
		}
	}
</style>
