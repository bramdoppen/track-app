<template>
	<div class="box-item">
		<strong class="box-title">{{ title }}</strong>
		<span class="box-sub">{{ sub }}<slot></slot></span>
		<Button class="box-button-edit" look="xsmall" :title="onEditText ? onEditText : 'Bewerk'" v-if="onEdit" @click="handleEdit()" />
	</div>
</template>

<script>
	import { toRefs } from "vue";
	import Button from "@/components/base/Button.vue";

	export default {
		components: {
			Button,
		},
		props: {
			title: {
				type: String,
				required: true,
			},
			sub: {
				type: String,
				required: false,
			},
			onEditText: {
				type: String,
				required: false,
			},
			onEdit: {
				type: Function,
				required: false,
			},
		},
		setup(props) {
			const { onEdit } = toRefs(props);

			const handleEdit = () => {
				onEdit.value();
			};
			return {
				handleEdit,
			};
		},
	};
</script>

<style scoped>
	.box-item {
		border-radius: 20px;
		padding: 16px 24px;
		box-shadow: 0px 3px 10px rgb(0 0 0 / 3%);
		font-weight: 300;
		background: #fff;
		display: grid;
		grid-template-areas: "title edit" "sub edit";
		column-gap: 10px;
		row-gap: 4px;
		grid-template-columns: 1fr auto;
		grid-template-rows: 1fr auto;
		align-items: center;
		& > .box-title {
			grid-area: title;
		}
		& > .box-sub {
			grid-area: sub;
			font-size: 0.9em;
		}
		& > .box-button-edit {
			grid-area: edit;
		}
		& > .box-button-delete {
			grid-area: delete;
		}
	}
</style>
