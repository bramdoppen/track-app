<template>
	<BasePage title="Scanner" :hideBottomBar="true" :translucent="true">
		<div class="main-scanner-content">
			<section class="frame-section">
				<h4 class="qrscanner__title qrscanner__title--gray">
					<span v-show="scanCount === 0">Richt camera op QR code</span>
					<span>{{ errorMessage }}</span>
				</h4>
			</section>
			<ScanStatus :scanCount="scanCount" :scanError="scanError" :isProcessing="isProcessing"></ScanStatus>
			<section class="frame-section">
				<h4 class="qrscanner__title">
					<span class="qrscanner__title--gray">Gekozen instelling:</span>
					<span>{{ currActionName }}</span>
					<span v-if="currConstructionPart.name">{{ currConstructionPart.name }}</span>
				</h4>
				<Button class="button" @click="prevPage" title="Klaar"></Button>
			</section>
		</div>
		<qr-stream @decode="onDecode" @init="onInit" :track="false" :camera="camera" class="qrscanner__stream qr-stream"></qr-stream>
	</BasePage>
</template>

<script>
	import store from "@/store";
	import anime from "animejs/lib/anime.es.js";

	import { QrStream } from "vue3-qr-reader";

	import Button from "@/components/base/Button.vue";
	import BasePage from "@/layouts/BasePage.vue";
	import ScanStatus from "@/layouts/scanner/ScanStatus.vue";
	import { fb, db } from "@/functions/firebaseConfig.js";
	import { updateBoxState } from "@/api/boxes";

	export default {
		name: "Scanner",
		components: {
			Button,
			BasePage,
			ScanStatus,
			QrStream,
		},
		data() {
			return {
				errorMessage: "",
				camera: "auto",
				currAction: store.state.currAction,
				scanCount: 0,
				scanError: false,
				kratId: null,
				beforeScanState: null,
				isProcessing: false,
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
					this.isProcessing = true;
					this.makeDocReq(content);
					this.scanCount++;
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
						this.isProcessing = false;
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
	.main-scanner-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: space-between;
		padding-bottom: 60px;
		z-index: 1;
		position: relative;
		color: #fff;
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
	.qrscanner__title {
		margin: 0;
		text-align: center;
		display: flex;
		flex-direction: column;
	}
	.qrscanner__title--gray {
		opacity: 0.5;
	}
</style>
