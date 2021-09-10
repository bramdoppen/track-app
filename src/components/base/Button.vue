<template>
	<component :is="tag" class="button" :type="compType" :class="[type, look]" :to="to" v-bind="$attrs">
		<span>{{ title }}</span>
		<slot></slot>
		<Icon :icon="icon" :size="iconSize" v-if="icon" />
	</component>
</template>

<script>
	import { toRefs, computed } from "vue";
	import Icon from "@/components/base/Icon";

	export default {
		components: {
			Icon,
		},

		props: {
			title: {
				type: String,
			},
			type: {
				type: String,
				default: "button",
			},
			icon: {
				type: String,
			},
			iconSize: {
				type: String,
			},
			look: {
				type: String,
			},
			to: {
				type: String,
				required: false,
			},
		},
		setup(props) {
			const { to, type } = toRefs(props);
			return {
				tag: computed(() => (to.value ? "router-link" : "button")),
				compType: computed(() => {
					if (type.value && !to.value) {
						return type.value;
					}
					return null;
				}),
			};
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

		&.xsmall {
			padding: 0px 10px;
			font-size: 14px;
			line-height: 1;
			min-height: 30px;
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
		
		&.completed {
			font-size: 18px;
			background: var(--color-primary);
			padding: 5px 10px;
			min-height: 50px;
			border-radius: 15px;
		}

		&.error {
			font-size: 18px;
			background: var(--color-error);
			color: #fff;
			padding: 5px 10px;
			min-height: 50px;
			border-radius: 15px;
		}

		&.nobutton {
			background: transparent;
			border: 0;
			text-decoration: underline;
			padding: 0;
			color: #000;
		}
	}
</style>
