<template>
	<div class="baseframe-container dark">
		<div class="baseframe-header">
			<!-- <FrameHeader :default="true" title="runnermodus" :prevPageId="prevPageId" /> -->
		</div>
		<div class="baseframe-content">
			<div class="baseframe-content-scroll scanner-grid">
				<section class="frame-section">
					<h4 class="qrscanner__title qrscanner__title--gray">
						<span v-show="firstScan">Richt camera op QR code</span>
						<span>{{ errorMessage }}</span>
					</h4>
				</section>
				<section class="frame-section center">
					<div class="qrscanner-holder">
						<div class="scan-counter">
							<span>{{ scanCount }}</span>
							<div class="scan-counter-blur"></div>
							<div class="scan-counter-back"></div>
						</div>
						<div class="qrscanner__item">
							<div v-if="firstScan && !scanError && !scanStarted">
								<svg class="qrscanner__icon icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 77 77">
									<g transform="translate(-169 -344)">
										<path
											d="M169 358.438v-11.43a3.008 3.008 0 013.008-3.008h11.43a3.008 3.008 0 110 6.016h-8.422v8.421a3.008 3.008 0 11-6.016 0zM242.992 344h-11.43a3.008 3.008 0 100 6.016h8.422v8.421a3.008 3.008 0 106.016 0v-11.43a3.008 3.008 0 00-3.008-3.007zm-59.554 70.984h-8.422v-8.421a3.008 3.008 0 10-6.016 0v11.43a3.008 3.008 0 003.008 3.007h11.43a3.008 3.008 0 100-6.016zm59.554-11.43a3.008 3.008 0 00-3.008 3.009v8.421h-8.422a3.008 3.008 0 100 6.016h11.43a3.008 3.008 0 003.008-3.008v-11.43a3.008 3.008 0 00-3.008-3.007zm-38.124-44.74v18.046a3.008 3.008 0 01-3.008 3.008h-18.047a3.008 3.008 0 01-3.007-3.008v-18.047a3.008 3.008 0 013.007-3.007h18.047a3.008 3.008 0 013.008 3.007zm-6.015 3.007H186.82v12.032h12.032V361.82zm33.837 18.047h-18.046a3.008 3.008 0 01-3.008-3.008v-18.047a3.008 3.008 0 013.008-3.007h18.046a3.008 3.008 0 013.008 3.007v18.047a3.008 3.008 0 01-3.008 3.008zm-3.007-18.047H217.65v12.032h12.032V361.82zm-24.815 27.823v18.046a3.008 3.008 0 01-3.008 3.008h-18.047a3.008 3.008 0 01-3.007-3.008v-18.046a3.008 3.008 0 013.007-3.008h18.047a3.008 3.008 0 013.008 3.008zm-6.015 3.007H186.82v12.032h12.032V392.65zm29.965 14.175h-10.302a3.008 3.008 0 01-3.008-3.008v-10.302a3.008 3.008 0 013.008-3.008h10.302a3.008 3.008 0 013.008 3.008v10.302a3.008 3.008 0 01-3.008 3.008zm-3.008-10.302h-4.286v4.286h4.286v-4.286z"
										/>
									</g>
								</svg>
								<h4>Scan QR</h4>
							</div>
							<div v-if="!firstScan && !scanError && !scanStarted">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 35" class="small">
									<defs />
									<g fill="none" fill-rule="evenodd" transform="translate(-185 -374)">
										<path
											fill="#FFF"
											fill-rule="nonzero"
											d="M205.687 407.332a5.308 5.308 0 01-7.505 0l-11.628-11.628a5.306 5.306 0 117.505-7.504l6.928 6.927a1.344 1.344 0 001.896 0l18.759-18.759a5.308 5.308 0 017.505 7.504l-23.46 23.46z"
										/>
									</g>
								</svg>
								<h4>Gelukt</h4>
							</div>
							<div v-if="scanError && !scanStarted">
								<svg viewBox="0 0 42 42" class="small" xmlns="http://www.w3.org/2000/svg">
									<g transform="translate(-186 -364)" fill="none" fill-rule="evenodd">
										<path
											d="M213.948 384.877l12.343-12.342a5 5 0 10-7.07-7.071l-12.343 12.344-12.343-12.344a5 5 0 00-7.07 7.071l12.342 12.342-12.342 12.342a5 5 0 107.07 7.071l12.343-12.342 12.343 12.343a4.98 4.98 0 003.535 1.464 5 5 0 003.535-8.535l-12.343-12.343z"
											fill="currentColor"
											fill-rule="nonzero"
										/>
									</g>
								</svg>
								<h4>Code onbekend</h4>
							</div>
							<div v-if="scanStarted">
								<svg
									xmlns:svg="http://www.w3.org/2000/svg"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									version="1.0"
									class="small loading-icon"
									viewBox="0 0 128 128"
									xml:space="preserve"
								>
									<g>
										<path
											d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z"
											fill="currentColor"
										/>
										<animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1000ms" repeatCount="indefinite"></animateTransform>
									</g>
								</svg>
								<h4>Laden...</h4>
							</div>
						</div>
					</div>
				</section>
				<section class="frame-section">
					<button v-show="scanCount > 0" class="button" @click="prevPage">Klaar</button>
					<h4 class="qrscanner__title">
						<span class="qrscanner__title--gray">Gekozen instelling:</span>
						<span>{{ currActionName }}</span>
						<span v-if="currConstructionPart.name">{{ currConstructionPart.name }}</span>
					</h4>
				</section>
			</div>
		</div>
		<qrcode-stream @decode="onDecode" @init="onInit" :track="false" :camera="camera" class="qrscanner__stream qr-stream"></qrcode-stream>
	</div>
</template>

<script>
	import store from "@/store";
	import anime from "animejs/lib/anime.es.js";

	import { QrcodeStream } from "vue-qrcode-reader";
	import { fb, db } from "@/functions/firebaseConfig.js";
	import { updateBoxState } from "@/api/boxes";

	// import FrameHeader from "../components/FrameHeader.vue";

	export default {
		name: "Scanner",
		components: {
			// FrameHeader,
			QrcodeStream,
		},
		data() {
			return {
				errorMessage: "",
				camera: "auto",
				currAction: store.state.currAction,
				scanCount: 0,
				prevPageId: 2,
				firstScan: true,
				scanError: false,
				kratId: null,
				beforeScanState: null,
				scanStarted: false,
			};
		},
		mounted() {
			const tl = anime.timeline();
			tl.add(
				{
					targets: ".frame-section > *",
					opacity: [0, 1],
					translateY: [20, 0],
					duration: 800,
					easing: "easeOutExpo",
					delay: anime.stagger(150),
				},
				"+=100",
			);
		},
		methods: {
			onDecode(content) {
				if (content.length === 20) {
					this.kratId = content;
					this.scanStarted = true;
					this.makeDocReq(content);
				}
			},
			onInit(promise) {
				promise
					.then(() => {})
					.catch((error) => {
						if (error.name === "NotAllowedError") {
							this.errorMessage = "Hey! I need access to your camera";
						} else if (error.name === "NotFoundError") {
							this.errorMessage = "Do you even have a camera on your device?";
						} else if (error.name === "NotSupportedError") {
							this.errorMessage = "Seems like this page is served in non-secure context (HTTPS, localhost or file://)";
						} else if (error.name === "NotReadableError") {
							this.errorMessage = "Couldn't access your camera. Is it already in use?";
						} else if (error.name === "OverconstrainedError") {
							this.errorMessage = "Constraints don't match any installed camera. Did you asked for the front camera although there is none?";
						} else {
							this.errorMessage = "UNKNOWN ERROR: " + error.message;
						}
					});
			},
			makeDocReq(input) {
				this.currAction = parseInt(this.currAction);

				const updateConstParts = (boxId, boxData) => {
					const emptyBox = {
						id: boxId,
						flowerType: boxData.flowerType,
					};
					if (this.currConstructionPart.id && this.currAction == 3) {
						// Wanneer toegewezen aan wagenonderdeel -> plaats box in Assigned Boxes (en haal hem weg bij Processed, als hij daar al bestaat);
						db.collection("constructionParts")
							.doc(this.currConstructionPart.id)
							.update({
								assignedBoxes: fb.firestore.FieldValue.arrayUnion(emptyBox),
								processedBoxes: fb.firestore.FieldValue.arrayRemove(emptyBox),
							});
					} else if (this.currAction == 4 && boxData.belongsToConstructionPart !== null) {
						// Wanneer afgerond op wagenonderdeel -> plaats box in Processed boxes (en haal hem weg bij Assigned);
						db.collection("constructionParts")
							.doc(boxData.belongsToConstructionPart.id)
							.update({
								processedBoxes: fb.firestore.FieldValue.arrayUnion(emptyBox),
								assignedBoxes: fb.firestore.FieldValue.arrayRemove(emptyBox),
							});
					}
					// Optie voor ' partially completed on this constructionpart ';
				};

				return db
					.collection("boxes")
					.doc(input)
					.get()
					.then((doc) => {
						if (doc.exists) {
							const constructionPart = this.currConstructionPart.id ? { id: this.currConstructionPart.id, name: this.currConstructionPart.name } : null;
							updateBoxState(this.kratId, doc.data().state, this.currAction, constructionPart);
							updateConstParts(doc.id, doc.data());
							this.scanError = false;
							this.errorMessage = "";
							this.successfulScanned();
						} else {
							anime({
								targets: ".qrscanner__item",
								scale: [0.9, 1],
								duration: 400,
								easing: "easeOutCubic",
								background: "rgba(171, 93, 111, 1)",
							});
							this.scanError = true;
							this.errorMessage = "Krat bestaat niet in Database";
						}
					})
					.then(() => {
						this.scanStarted = false;
					})
					.catch((error) => {
						(this.errorMessage = "Error:"), error;
					});
			},
			turnCameraOn() {
				this.camera = "auto";
			},
			turnCameraOff() {
				this.camera = "off";
			},
			successfulScanned() {
				this.scanCount++;
				this.firstScan = false;
				const tl = anime.timeline({
					duration: 400,
					easing: "easeInOutCirc",
				});
				tl.add({
					targets: ".qrscanner__item",
					scale: 0.9,
					duration: 100,
					easing: "easeInCubic",
					background: "rgba(255, 255, 255, 0.2)",
				});
				tl.add(
					{
						targets: ".qrscanner__item",
						scale: 1.0,
						background: "#6369D1",
						easing: "easeOutQuart",
					},
					"-=0",
				);
				if (this.scanCount <= 1) {
					tl.add(
						{
							targets: ".scan-counter",
							translateY: [0, -83],
							opacity: [0, 1],
							duration: 400,
							easing: "easeInOutCirc",
						},
						"-=300",
					);
				} else {
					tl.add(
						{
							targets: ".scan-counter > .scan-counter-blur",
							scale: [0.8, 1.5],
							opacity: [0.5, 0],
							duration: 400,
							easing: "easeOutCirc",
						},
						"-=300",
					);
				}
			},
			prevPage() {
				this.$router.go(-1);
			},
		},
		computed: {
			currActionName() {
				return store.state.places[this.currAction];
			},
			currConstructionPart() {
				return store.state.currConstructionPart;
			},
		},
		beforeUnmount() {
			store.commit("changeConstructionPart", { id: null, name: null });
		},
	};
</script>

<style scoped>
	.scanner {
		position: relative;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		flex-direction: column;
		height: 100vh;
		align-items: center;
		width: 100%;
		justify-content: space-around;
		background: var(--color-bg);
		color: var(--color-text);
		&.start {
			justify-content: flex-start;
		}
		&.dark {
			background: var(--color-dark);
			color: #fff;
		}
		&.no-overflow {
			overflow: hidden;
		}
		&.main {
			& video {
				position: absolute;
				height: 100vh;
				left: -999px;
				right: -999px;
				margin: auto;
			}
			& .scanner-main-messages {
				position: absolute;
				bottom: 0;
				left: 0;
				text-align: center;
				padding: 20px;
				width: 100%;
			}
		}
	}
	h1 {
		color: red;
	}

	.scanner-grid {
		display: grid;
		grid-template-rows: minmax(auto, 200px) minmax(360px, 1fr) minmax(auto, 200px);
		height: 100%;
		& > *:nth-child(1) {
			align-self: start;
			padding-top: 20px;
		}
		& > *:nth-child(2) {
			align-self: center;
			margin-top: 0;
		}
		& > *:nth-child(3) {
			align-self: end;
			padding-bottom: 40px;
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
		&.center {
			justify-self: center;
			width: auto;
		}
	}
	.button {
		background: var(--color-secondary);
		margin-bottom: 20px;
	}
	.qrscanner__item {
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 180px;
		min-width: 180px;
		background: rgba(255, 255, 255, 0.2);
		padding: 27px 20px;

		border-radius: 8px;
		width: auto;
		color: #fff;
		z-index: 10;
		box-shadow: 0px 20px 40px 20px rgba(255, 255, 255, 0.1);
		& * {
			font-family: var(--font-special);
		}
		& > * {
			margin: 0;
			display: flex;
			align-items: center;
			flex-direction: column;

			& > * {
				margin: 0;
				& + * {
					margin-top: 30px;
				}
			}
		}
		& svg {
			width: 75px;
			height: 75px;
			&.small {
				width: 50px;
				height: 50px;
			}
		}
	}
	.qrscanner__title {
		margin: 0;
		text-align: center;
		display: flex;
		flex-direction: column;
	}

	.qrscanner__title--gray {
		opacity: 0.5;
	}
	.qrscanner__stream {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}
	.qrscanner-holder {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		margin: 35px 0 0;
	}
	.scan-counter {
		position: absolute;
		width: 51px;
		height: 51px;
		border: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-title);
		top: 0;
		margin-top: 0;
		transform: translateY(-83px);
		opacity: 0;
		pointer-events: none;
		& > span {
			z-index: 2;
		}
		&::before,
		&::after {
			width: 10px;
			height: 10px;
			content: "";
			display: block;
			position: absolute;
			background: #6269d2;
			border-radius: 50%;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			top: auto;
			transform: translateY(15px);
		}
		&::after {
			width: 6px;
			height: 6px;
			transform: translateY(26px);
		}
	}
	.scan-counter-blur {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		transform: scale(0.8);
		z-index: 0;
		border-radius: 50%;
	}
	.scan-counter-back {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--color-primary);
		z-index: 1;
		border-radius: 50%;
	}
</style>
