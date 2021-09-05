<template>
	<div class="page">
		<div class="login-box">
			<header>
				<h1>
					Dahlia <br />
					Beheer Systeem
				</h1>
				<span>Je bent er bijna!</span>
			</header>
			<section v-if="user">
				<span>Je account <strong>{{ user.email }}</strong> is nog niet geactiveerd. <br>Loop even naar Bram toe. Die activeert jouw account.</span><br /><br>
				<strong v-if="storedUser && storedUser.corsoGroup"> <a :href="`https://wa.me/31640521978?text=${encodeURI(formattedMessage)}`">Stuur Bram een appje</a>. </strong><br><br>
				<iframe src="https://giphy.com/embed/QPQ3xlJhqR1BXl89RG" width="480" height="400" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
			</section>
			<Button to="/login" style="margin-top: 10px;" title="Terug naar inloggen"> </Button>
			<footer>
				Powered by Lansink Bluiminck
			</footer>
		</div>
	</div>
</template>

<script>
	import { computed, watchEffect, watch } from "vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import { getUserFromDb } from "@/api/user";
	import { useAuth } from "@vueuse/firebase/useAuth.esm";
	import { fb } from "@/functions/firebaseConfig.js";
	import Button from "@/components/base/Button";

	export default {
		components: {
			Button,
		},
		setup() {
			const router = useRouter();
			const store = useStore();
			const { user } = useAuth(fb.auth);
			const storedUser = computed(() => store.state.user);

			watchEffect(() => {
				if (user.value) {
					getUserFromDb(user.value.uid).then((userResponse) => {
						store.dispatch("userLogin", userResponse.data());
					});
				}
			});

			watch(
				() => storedUser.value.isActivated,
				() => {
					router.push("/");
				},
			);

			return {
				user,
				storedUser,
				formattedMessage: computed(() => `Hi Bram, Ik heb mij aangemeld met ${user.value.email} vanuit ${storedUser.value.corsoGroup.name} en wil graag toegang tot het DMS.`),
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
		background: white;
		border-radius: 10px;
		outline: 0;
		transition: border-color 0.2s ease;
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
    padding-bottom: 50px;
	}
	section {
		text-align: center;
	}
	iframe {
		width: 100%;
    max-height: 130px;
	}
</style>
