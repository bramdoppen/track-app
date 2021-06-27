<template>
	<div class="wrapper">
		<div class="title-holder">
			<h1>Tandt</h1>
			<p v-if="!isForgot">
				Houd bij waar de bloemenkratten zich bevinden.
			</p>
		</div>
		<div class="form-holder">
			<p v-if="forgotMessage" class="forgotMessageItem">{{ forgotMessage }}</p>
			<form class="signin" v-if="!isForgot" @submit="login">
				<div class="f-row">
					<label for="input-one" class="f-label">E-mailadres:</label>
					<input id="input-one" class="f-input" v-model="user.email" type="email" required placeholder="voorbeeld@bloemencorso.nl" />
				</div>
				<div class="f-row">
					<label for="input-two" class="f-label">Wachtwoord:</label>
					<input id="input-two" class="f-input" v-model="user.password" type="password" required placeholder="Password" />
				</div>
				<div class="f-row">
					<span class="errors">{{ logErr }}</span>
				</div>
				<button :class="{ loading: isLoading }" type="submit" class="button f-button">Inloggen</button>
				<button
					@click="
						isForgot = true;
						forgotMessage = null;
					"
					class="nobutton"
					type="button"
					style="margin-top: 10px;"
				>
					Wachtwoord vergeten
				</button>
				<a href="mailto:tandt@bram.onl?subject=Geef%20mij%20toegang%20tot%20Tandt&body=Geef%20op:%20naam,%20e-mailadres%20en%20corsogroep." class="nobutton">Geef mij toegang</a>
			</form>

			<form class="signin" v-if="isForgot && !forgotMessage" @submit="sendForgotPassword">
				<h3>Wachtwoord vergeten</h3>
				<div class="f-row">
					<label for="input-one" class="f-label">E-mailadres:</label>
					<input id="input-one" class="f-input" v-model="userEmailForgot" type="email" required placeholder="voorbeeld@bloemencorso.nl" />
				</div>

				<div class="f-row">
					<span class="errors">{{ logErr }}</span>
				</div>
				<button :class="{ loading: isLoading }" type="submit" class="button f-button">Wachtwoord resetten</button>
				<button
					@click="
						isForgot = false;
						forgotMessage = null;
					"
					type="button"
					class="nobutton"
					style="margin-top: 10px;"
				>
					Terug naar inloggen
				</button>
			</form>
		</div>
	</div>
</template>

<script>
	import { fb, db } from "@/functions/firebaseConfig.js";

	export default {
		name: "LoginScreen",
		data: function() {
			return {
				user: {
					email: null,
					password: null,
				},
				userEmailForgot: null,
				isLoading: false,
				isForgot: false,
				forgotMessage: null,
				logErr: null,
				routerRedirect: null,
			};
		},
		methods: {
			login(e) {
				e.preventDefault();

				// some vars
				const scope = this;
				scope.isLoading = true;
				scope.logErr = null;

				// try signing the user in
				fb.auth()
					.signInWithEmailAndPassword(this.user.email, this.user.password)
					.then((result) => {
						// check if there is a record of this user(email) in database and get values.
						this.getUserCredentialsFromDatabase(result.user.email)
							.then((querySnapshot) => {
								querySnapshot.forEach((doc) => {
									const userData = doc.data();
									this.$store.commit("userLogin", {
										newState: true,
										id: doc.id,
										name: userData.name,
										email: userData.email,
										permissions: userData.permissions,
									});
									this.$store.commit("setCorsoGroup", {
										id: userData.corsoGroupId,
										name: userData.corsoGroup,
									});
								});
								this.redirectRouter();
								this.isLoading = false;
							})
							.catch(() => {
								this.isLoading = false;
								this.logErr = "Bestaat geen account";
							});
					})

					.catch(() => {
						this.isLoading = false;
						this.logErr = "Ongeldig e-mailadres of wachtwoord.";
					});
			},

			redirectRouter() {
				if (this.routerRedirect) {
					this.$router.push({ path: this.routerRedirect });
				} else {
					this.$router.push({ path: "/" });
				}
			},

			sendForgotPassword(e) {
				e.preventDefault();
				const that = this;
				const emailAddress = this.userEmailForgot;
				if (emailAddress) {
					fb.auth()
						.sendPasswordResetEmail(emailAddress)
						.then(function() {
							that.forgotMessage = "Gelukt, we hebben een e-mail verzonden naar het opgegeven e-mailadres met verdere instructies.";
						})
						.catch(function() {
							that.forgotMessage = "Error. We konden jouw wachtwoord niet resetten. Probeer het later opnieuw.";
						})
						.finally(function() {
							that.userEmailForgot = null;
							that.isForgot = false;
						});
				}
			},

			getUserCredentialsFromDatabase(email) {
				return db
					.collection("users")
					.where("email", "==", email)
					.get();
			},
		},
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				vm.routerRedirect = to.query.redirect;
			});
		},
	};
</script>

<style scoped>
	h1 {
		font-family: var(--font-special);
		color: var(--color-primary);
	}
	h3 {
		font-weight: 600;
		color: var(--color-primary);
		text-align: center;
	}

	.wrapper {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: minmax(min-content, 40%) 1fr;
		height: 100%;
		justify-items: center;
		align-items: start;
		& > * {
			padding-left: var(--m-base);
			padding-right: var(--m-base);
			width: 100%;
			max-width: calc(290px + (var(--m-base) * 2));
		}
	}
	.title-holder {
		padding-top: var(--m-base);
		padding-bottom: var(--m-base);
		text-align: center;
		align-self: end;
	}
	.form-holder {
	}
	.frame-content {
		padding: 0 var(--m-base);
		margin-top: 10px;
		width: 100%;
		flex: 1;
		z-index: 10;
		& > hr {
			all: unset;
			display: block;
			border-top: 2px solid rgba(151, 151, 151, 0.25);
			margin: 50px 0;
		}
	}
	.frame-section {
		width: 100%;
		& > header {
			margin: 0;
		}
		& > * + * {
			margin-top: var(--m-base);
		}
		& > .button + .button {
			margin-top: 10px;
		}
		& > header + * {
			margin-top: 20px;
		}
		& + .frame-section {
			margin-top: 50px;
		}
	}
	.f-row {
		& + .f-row {
			margin-top: 20px;
		}
		& + .f-button {
			margin-top: 10px;
		}
	}

	.f-input {
		appearance: none;
		border: 1px solid var(--color-border);
		height: 50px;
		display: flex;
		align-items: center;
		font-size: 16px;
		background: #fff;
		border-radius: 9px;
		color: var(--color-text);
		width: 100%;
		padding: 0 20px;
	}
	.f-label {
		font-weight: 600;
		font-size: var(--fz-base);
		display: inline-block;
		margin-bottom: 5px;
	}
	.f-button::before {
		content: "";
		height: 5px;
		position: absolute;
		top: auto;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.2);
		display: block;
		z-index: 0;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}
	.f-button::after {
		content: "";
		height: 5px;
		position: absolute;
		top: auto;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.4);
		display: block;
		z-index: 0;
		opacity: 0;
		transform: translateX(-100%);
		transition: opacity 0.2s ease-in-out;
	}
	.f-button.loading::before {
		opacity: 1;
	}
	.f-button.loading::after {
		opacity: 1;
		animation: buttonload 1s cubic-bezier(0.62, 0.02, 0.15, 0.94) infinite;
	}
	.errors {
		color: red;
	}

	.nobutton {
		appearance: none;
		background: transparent;
		border: 0;
		width: 100%;
		text-decoration: underline;
		padding: 15px;
		display: block;
		text-align: center;
		color: inherit;
	}
	.forgotMessageItem {
		border: 2px solid var(--color-primary);
		border-radius: 8px;
		padding: 10px 20px;
		font-size: 14px;
	}
</style>
