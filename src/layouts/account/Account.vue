<template>
	<BasePage title="Account">
		<div class="faketable-table">
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Ingelogd als:</span>
				</div>
				<div class="faketable-content">
					<div>{{ user.displayName }} ({{ user.email }})</div>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Corsogroep:</span>
				</div>
				<div class="faketable-content">
					<div>{{ user.corsoGroup.name }}</div>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Administrator:</span>
				</div>
				<div class="faketable-content">
					<div>{{ user.isAdmin ? "Ja" : "Nee" }}</div>
				</div>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>Account geactiveerd:</span>
				</div>
				<div class="faketable-content">
					<div>{{ user.isActivated ? "Ja" : "Nee" }}</div>
				</div>
			</div>
			<div class="faketable-row">
				<Button @click="logout()" title="Uitloggen"></Button>
			</div>
      <div class="faketable-row">
				<div class="faketable-head">
					<span>App-versie:</span>
				</div>
				<div class="faketable-content">
          v{{version}}
				</div>
			</div>
			<Button @click="refresh()" look="green" title="Refresh app"></Button>
		</div>
	</BasePage>
</template>

<script>
  import { version } from "/package.json"
	import BasePage from "@/layouts/BasePage.vue";
	import Button from "@/components/base/Button.vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import { logoutUser } from "@/api/user";

	export default {
		components: {
			BasePage,
			Button,
		},
		setup() {
			const store = useStore();
			const router = useRouter();

			return {
				user: store.state.user,
				corsoGroup: store.state.corsoGroup,
        version,
				refresh: () => {
          
					console.log(" refr");
				},
				logout: () => {
					if (window.confirm("Wilt u uitloggen?")) {
						logoutUser().then(() => {
							store.dispatch("userLogOut");
							router.push("/");
						});
					}
				},
			};
		},
	};
</script>

<style scoped>
	h5 {
		font-family: var(--font-title);
		font-weight: 600;
		font-size: 16px;
		margin: 0;
		color: var(--color-dark);
	}
	table,
	th,
	td,
	tr {
		padding: 0;
	}
	th {
		text-align: left;
	}
	.td-flex {
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
		& > span > span:first-child {
			display: inline-block;
			margin-right: 10px;
		}
	}
	.parts-header {
		display: flex;
		align-items: center;
		min-height: 60px;
	}
	.parts-panel {
	}
	.parts-item {
		padding: 10px 0;
		&:not(:last-child) {
			border-bottom: 1px solid gray;
		}
	}
	.fakelink {
		display: inline-flex;
		background: #ececec;
		padding: 8px 20px;
		width: auto;
		border-radius: 5px;
		font-weight: 600;
	}
	.faketable-row {
		margin-bottom: 20px;
	}
	.faketable-table {
		display: flex;
		flex-direction: column;
	}
	.faketable-head {
		font-weight: 600;
	}
	input,
	select {
		padding: 8px 12px;
		outline: 0;
		border: 1px solid #dedede;
		border-radius: 5px;
		width: 100%;
		font-size: 16px !important;
		appearance: none;
	}
	.logboek-item {
		display: grid;
		border-radius: 10px;
		margin-left: 30px;
		background: #f9f9f9;
		padding: 20px;
		grid-template-areas: "timestamp user" "message message";
		grid-template-columns: minmax(0, 1fr) auto;
		position: relative;
		gap: 4px;
		&::after {
			content: "";
			display: block;
			width: 12px;
			height: 12px;
			background: #fff;
			border: 2px solid var(--color-primary);
			border-radius: 50%;
			position: absolute;
			top: 20px;
			left: -30px;
		}
		&::before {
			content: "";
			display: block;
			width: 35px;
			height: calc(100% + 20px);
			background: transparent;
			position: absolute;
			top: 27px;
			left: -23px;
			border-top: 2px dashed #d0d0d0;
			border-left: 2px dashed #d0d0d0;
			z-index: -1;
		}
		&:last-of-type::before {
			border-left: 0;
		}
		&:last-of-type::after {
			background: var(--color-primary);
		}
	}
	.logboek-timestamp {
		grid-area: timestamp;
		font-size: 12px;
		font-family: var(--font-title);
	}
	.logboek-user {
		grid-area: user;
		font-size: 12px;
		font-weight: 200;
		font-family: var(--font-title);
	}
	.logboek-message {
		grid-area: message;
		font-size: 14px;
		font-family: var(--font-title);
		font-weight: 600;
	}
</style>
