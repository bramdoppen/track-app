<template>
	<div class="bar-container">
		<router-link to="/kratten" class="bar-item">
			<Icon icon="boxes" />
			<span class="bar-text">Kratten</span>
		</router-link>
		<router-link to="/inzicht" class="bar-item">
			<Icon icon="insight" />
			<span class="bar-text">Inzicht</span>
		</router-link>
		<router-link to="/instellingen" class="bar-item">
			<Icon icon="settings" />
			<span class="bar-text">Beheer</span>
		</router-link>
	</div>
</template>

<script>
	import Icon from "@/components/base/Icon";

	export default {
		components: {
			Icon,
		},
	};
</script>

<style scoped>
	.bar-container {
		position: sticky;
		bottom: 0;
		z-index: 100;
		background: white;
		display: flex;
		justify-content: space-around;
		height: 70px;
		border-top: 1px solid #e4e4e4;
		flex: 0 0 auto;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.bar-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: var(--color-border);
		font-family: var(--font-title);
		font-weight: 600;
		text-decoration: none;

		&.router-link-exact-active {
			color: var(--color-primary);
		}
	}

	.bar-text {
		display: inline-block;
		margin-top: 3px;
	}
</style>
