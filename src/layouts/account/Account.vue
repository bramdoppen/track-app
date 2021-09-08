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
					<div>{{ user.isAdmin ? "Ja" : "Nee" }}, permissie-level: {{ user.permissionLevel }}</div>
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
				<div class="faketable-head">
					<span>Voorkeuren:</span>
				</div>
				<div class="faketable-content">
					<BoxesList style="margin-top: 10px;" gap="6px">
						<div class="box-item">
							<strong class="box-title">Haptische feedback (trillingen)</strong>
							<label class="switch box-button-edit">
								<input type="checkbox" @change="handlePreferenceChange($event, 'allowHaptics')" :checked="user.preferences.allowHaptics" />
								<span class="slider round"></span>
							</label>
						</div>
						<div class="box-item">
							<strong class="box-title">Geluiden afspelen</strong>
							<label class="switch box-button-edit">
								<input type="checkbox" @change="handlePreferenceChange($event, 'allowSound')" :checked="user.preferences.allowSound" />
								<span class="slider round"></span>
							</label>
						</div>
					</BoxesList>
				</div>
			</div>
			<div class="faketable-row">
				<Button @click="logout()" title="Uitloggen"></Button>
			</div>
			<div class="faketable-row">
				<div class="faketable-head">
					<span>App-versie:</span>
				</div>
				<div class="faketable-content">v{{ version }}</div>
			</div>
			<Button @click="refresh()" look="green" title="Refresh app"></Button>
		</div>
		<div class="mede-mogelijk">
			Deze app kon niet bestaan zonder de ideëen van <strong>{{getRandomQuote()}}</strong>
		</div>
	</BasePage>
</template>

<script>
	import { version } from "/package.json";
	import BasePage from "@/layouts/BasePage.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import { logoutUser } from "@/api/user";
	import { db } from "@/functions/firebaseConfig.js";

	export default {
		components: {
			BasePage,
			Button,
			BoxesList,
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			const user = store.state.user;

			const handlePreferenceChange = (e, field) => {
				store.dispatch("userPreferenceChange", { type: field, val: e.target.checked });
				db.collection("users")
					.doc(user.uid)
					.set(
						{
							preferences: {
								[field]: e.target.checked,
							},
						},
						{ merge: true },
					);
			};

			const randomQuotes = ["Tonny", "Bart", "Eric", "Emiel", "Ewald", "Daniel", "jou!"];

			return {
				user,
				corsoGroup: store.state.corsoGroup,
				version,
				handlePreferenceChange,
				refresh: () => {
					window.location.reload();
				},
				logout: () => {
					if (window.confirm("Wilt u uitloggen?")) {
						logoutUser().then(() => {
							store.dispatch("userLogOut");
							router.push("/");
						});
					}
				},
				getRandomQuote: () => randomQuotes[Math.floor(Math.random() * randomQuotes.length)],
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
	}
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: #2196f3;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196f3;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}

	.mede-mogelijk {
		text-align: center;
		opacity: 0.75;
		margin: 30px auto 20px auto;
		max-width: 70%;
	}
</style>
