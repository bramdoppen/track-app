<template>
	<div class="result-item">
		<span>{{ result.id }}</span>
		<span class="bold">{{ result.name }}</span>
		<span class="amountholder">
			<button @click="amount--" :disabled="amount < 1" type="button">
				-
			</button>
			<input min="0" type="number" v-model.number="amount" />
			<button @click="amount++" type="button">+</button>
		</span>
	</div>
</template>

<script>
	import { ref, toRefs, watch } from "vue";

	export default {
		props: {
			result: {
				type: Object,
			},
			batch: {
				type: Array,
			},
		},
		emits: ["update:batch"],
		setup(props, { emit }) {
			const { result, batch } = toRefs(props);
			const amount = ref(0);

			function updateAmount(newValue) {
				// Get the boxindex
				const boxExistingIndex = batch.value.findIndex((box) => {
					if (box.flowerType) {
						return box.flowerType.id === result.value.id;
					}
				});

				if (batch) {
					if (newValue > 0 && boxExistingIndex !== -1) {
						// If flower/box already added to array, only update amount
            batch.value[boxExistingIndex].amount = newValue
						// this.$set(this.boxes[boxExistingIndex], "amount", newValue);
					} else if (newValue > 0 && boxExistingIndex === -1) {
						// Box not added to array? Add it!
						batch.value.push({
							id: null,
							amount: newValue,
							flowerType: result.value,
						});
					} else {
						// If the new value is 0, remove box from array.
						batch.value.splice(boxExistingIndex, 1);
					}
				}
			}

			watch(amount, (newValue) => {
				updateAmount(newValue);
			});

			watch(batch, (newValue) => {
				emit("update:batch", newValue);
			});

			return {
				amount,
			};
		},
	};
</script>

<style scoped>
	.result-item {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-column-gap: 20px;
		align-items: center;
		box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.15);
		padding: 10px 20px;
		border-radius: 10px;
		min-height: 70px;
		& + .result-item {
			margin-top: 20px;
		}
	}
	.amountholder {
    --button-size: 40px;
		display: grid;
		grid-template-columns: var(--button-size) 50px var(--button-size);
		align-items: center;
		justify-items: center;
		height: 100%;
		& > button {
			width: var(--button-size);
			height: var(--button-size);
			-webkit-appearance: none;
			border: 0;
			border-radius: 10px;
			background: #e2e2e2;

			font-weight: 700;
			font-size: 20px;
			transition: opacity 0.15s ease-out;
			&[disabled="disabled"] {
				opacity: 0.3;
			}
		}
		& > input {
			padding: 5px;
			text-align: center;
			background: transparent;
			border: 0;
			box-shadow: none;
			width: 100%;
			height: 100%;
		}
	}
	.bold {
		font-weight: 700;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
