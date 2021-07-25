<template>
	<div class="box-item">
		<strong class="box-title">{{ title }}</strong>
		<span class="box-sub">{{ sub }}</span>
		<Button class="box-button-edit" look="xsmall" title="Bewerk" v-if="onEdit" @click="handleEdit()" />
		<Button class="box-button-delete" look="xsmall" title="Delete" v-if="onDelete" @click="handleDelete()" />
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
			onEdit: {
				type: Function,
				required: false,
			},
			onDelete: {
				type: Function,
				required: false,
			},
		},
		setup(props) {
			const { onEdit, onDelete } = toRefs(props);

			const handleEdit = () => {
				onEdit.value();
			};
			const handleDelete = () => {
				onDelete.value();
			};
			return {
				handleEdit,
				handleDelete,
			};
		},
	};
</script>

<style scoped>
	.box-item {
		border-radius: 30px;
		padding: 30px;
		box-shadow: 0px 3px 10px rgb(0 0 0 / 3%);
		font-weight: 300;
		background: #fff;
		display: grid;
		grid-template-areas: "title edit delete" "sub edit delete";
		grid-template-columns: 1fr auto auto;
		grid-template-rows: 1fr auto;
		& > .box-title {
			grid-area: title;
		}
		& > .box-sub {
			grid-area: sub;
		}
		& > .box-button-edit {
			grid-area: edit;
		}
		& > .box-button-delete {
			grid-area: delete;
		}
	}
</style>
