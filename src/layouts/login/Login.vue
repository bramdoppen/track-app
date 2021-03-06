<template>
	<div class="page">
		<div class="login-box">
			<header>
				<h1>
					Dahlia <br />
					Beheer Systeem
				</h1>
				<span v-if="!ui.registrationActive">Login met jouw gegevens</span>
				<span v-if="ui.registrationActive">Registreer een nieuw account</span>
			</header>
			<form class="form" @submit.prevent="handleSubmit(user)">
				<div class="f-row" v-if="ui.registrationActive">
					<label for="input-zero" class="f-label">Jouw naam:</label>
					<input id="input-zero" class="f-input" v-model="user.displayName" type="text" required placeholder="Jouw naam" />
				</div>
				<div class="f-row">
					<label for="input-one" class="f-label">E-mail:</label>
					<input id="input-one" class="f-input" v-model="user.email" type="email" required placeholder="E-mail" />
				</div>
				<div class="f-row">
					<label for="input-two" class="f-label">Wachtwoord:</label>
					<input id="input-two" class="f-input" v-model="user.password" type="password" required placeholder="Wachtwoord" />
				</div>
				<div class="f-row" v-if="ui.registrationActive">
					<label for="input-three" class="f-label">Corsogroep:</label>
					<select id="input-three" class="f-input" v-model="user.corsoGroup" required>
						<option disabled>Selecteer groep</option>
						<option v-for="group in corsoGroups" :key="group.id" v-bind:value="group">{{ group.name }}</option>
					</select>
				</div>
				<div class="f-row" v-if="ui.error">
					<span class="errors">{{ ui.error.message }}</span>
				</div>
				<Button @click="ui.registrationActive = !ui.registrationActive" class="nobutton" style="margin-top: 10px;" :title="ui.registrationActive ? 'Terug naar inloggen' : 'Registreren'">
				</Button>
				<Button type="submit" title="Login"></Button>
			</form>
			<footer>
				Powered by Lansink Bluiminck
			</footer>
		</div>
	</div>
</template>

<script>
	import { ref, onMounted } from "vue";
	import { fetchCorsoGroups } from "@/api/corsoGroups.js";
	import { loginUser, registerUser } from "@/api/user.js";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import Button from "@/components/base/Button";

	export default {
		components: {
			Button,
		},

		setup() {
			const store = useStore();
			const router = useRouter();
			
			// If user is logged in, redirect to root
			if(store.state.user !== null) {
				router.push("/");
			}

			// Build user vars
			const user = ref({
				displayName: null,
				email: null,
				password: null,
				corsoGroup: null,
			});

			// Build ui vars
			const ui = ref({
				loading: false,
				error: null,
				registrationActive: false,
			});

			// Get corsoGroups
			const corsoGroups = ref([]);
			const getCorsoGroups = async () => {
				corsoGroups.value = await fetchCorsoGroups();
			};

			onMounted(getCorsoGroups);

			// Handle submit form
			const handleSubmit = async (user) => {
				ui.value.error = null;
				ui.value.loading = true;
				try {
					let response = null;
					if (ui.value.registrationActive) {
						response = await registerUser(user);
					} else {
						response = await loginUser(user);
					}
					store.dispatch("userLogin", response);
					router.push("/");
					ui.value.loading = false;
				} catch (err) {
					ui.value.error = err;
					ui.value.loading = false;
				}
			};

			return {
				user,
				ui,
				corsoGroups,
				handleSubmit,
			};
		},
	};
</script>

<style scoped>
	.page {
		background: #fff;
		width: 100%;
		height: 100vh;
		padding-top: 40px;
		overflow: auto;
	}

	.login-box {
		width: min(400px, 100%);
		margin: 0 auto;
		padding: 20px;
		background: #fff;
		display: flex;
		flex-direction: column;
		row-gap: 30px;
		opacity: 0;
		animation: showLogin 0.4s 0.2s cubic-bezier(0, 0.65, 0.16, 0.98) forwards;
		height: 100%;
		& > header {
			text-align: center;
		}
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 10px;
		& > span {
			opacity: 0.75;
		}
	}

	.form {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
		flex: 1;
	}

	.f-row {
		display: flex;
		flex-direction: column;
		text-align: left;
		gap: 8px;
	}

	h1 {
		margin: 0;
		font-weight: 700;
		color: var(--color-primary);
	}

	label {
		font-weight: 600;
		font-size: 14px;
		font-family: var(--font-title);
	}

	input,
	select {
		font-family: var(--font-title);
		padding: 19px 25px;
		font-size: 16px;
		border: 2px solid #eaeaea;
		background-color: white;
		border-radius: 10px;
		outline: 0;
		transition: border-color 0.2s ease;
		appearance: none;
	}
	select {
		background-size: 20px;
		background-position: right 10px center;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiIHdpZHRoPSIxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNDA4IDcwNHEwIDI2LTE5IDQ1bC00NDggNDQ4cS0xOSAxOS00NSAxOXQtNDUtMTlsLTQ0OC00NDhxLTE5LTE5LTE5LTQ1dDE5LTQ1IDQ1LTE5aDg5NnEyNiAwIDQ1IDE5dDE5IDQ1eiIvPjwvc3ZnPg==");
	}
	input:focus,
	select:focus {
		border-color: var(--color-secondary);
	}
	.errors {
		color: var(--color-error);
		line-height: 1.4;
	}

	@keyframes showLogin {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	footer {
		text-align: center;
		opacity: 0.5;
	}
</style>
