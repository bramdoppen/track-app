<template>
	<div class="box">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "Box",
	};
</script>

<style scoped>
	.box {
		border-radius: 30px;
		padding: 30px;
		box-shadow: 0px 3px 10px rgb(0 0 0 / 3%);
		font-weight: 300;
		background: #fff;

		& > * {
			margin: 0;

			& + * {
				margin-top: 4px;
			}
			& + button {
				margin-top: 20px;
			}

			&.h3 {
				font-size: 20px;
				font-weight: 600;
				color: var(--color-text);
			}
		}

		& >>> button {
			font-size: 18px;
			background: #6ea4bf;
			padding: 5px 10px;
			min-height: 50px;
			border-radius: 15px;
		}
	}
</style>
