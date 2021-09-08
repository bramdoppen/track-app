<template>
	<div>
		<div class="printconfirm" v-if="ui.showConfirmDialog">
			<div class="confirm-dialog">
				<h4>Start code op eerste blad</h4>
				<div class="startposition">
					<span
						@click="setStartPosition(1)"
						:class="{ 's-active': startCol == 1 }"
					></span>
					<span
						@click="setStartPosition(2)"
						:class="{ 's-active': startCol == 2 }"
					></span>
					<span
						@click="setStartPosition(3)"
						:class="{ 's-active': startCol == 3 }"
					></span>
					<span
						@click="setStartPosition(4)"
						:class="{ 's-active': startCol == 4 }"
					></span>
					<span
						@click="setStartPosition(5)"
						:class="{ 's-active': startCol == 5 }"
					></span>
					<span
						@click="setStartPosition(6)"
						:class="{ 's-active': startCol == 6 }"
					></span>
				</div>
				<p>
					Let op, deze actie maakt de kratten
					<u>direct</u> aan in de database.
				</p>
				<button class="button" @click="startPrinting">
					Print labels
				</button>
			</div>
		</div>
		<div class="linelistHolder">
			<ul class="linelist" :data-start-col="startCol" v-if="boxesPrintList && boxesPrintList.length > 0">
				<li
					v-for="(singleCode, index) in boxesPrintList"
					:key="index"
					class="printline"
				>
					<span class="item" v-if="singleCode">
						<span class="kratid">{{ singleCode.id }}</span>
						<img class="qr" :src="singleCode.imageUrl" />
						<span class="bloemitem">
							<span class="bloemid">{{
								singleCode.flowerType.id
							}}</span>
							<span class="bloemname">{{
								singleCode.flowerType.name
							}}</span>
						</span>
					</span>
					<span class="item" v-if="singleCode">
						<span class="kratid">{{ singleCode.id }}</span>
						<img class="qr" :src="singleCode.imageUrl" />
						<span class="bloemitem">
							<span class="bloemid">{{
								singleCode.flowerType.id
							}}</span>
							<span class="bloemname">{{
								singleCode.flowerType.name
							}}</span>
						</span>
					</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { createBox } from "@/api/boxes.js";

	import store from "@/store";
	import QRCode from "qrcode";

	export default {
		name: "PrintLabels",
		props: {
			boxes: {
				type: Array,
			},
			createInDatabase: {
				type: Boolean,
				default: false,
			},
			printStarted: {
				type: Function,
			},
		},
		data: function() {
			return {
				boxesPrintList: [],
				ui: {
					showConfirmDialog: true,
				},
				printer: {
					timeout: null,
					isPrinting: false,
				},
			};
		},
		methods: {
			createQR(imageInput) {
				return QRCode.toDataURL(imageInput.toString(), {
					type: "svg",
				}).then((url) => {
					return url;
				});
			},
			setStartPosition(newStartCol) {
				store.commit("changeStartCol", newStartCol);
			},
			createLabels(boxes) {
				const promisesList = [];

				boxes.forEach((box) => {
					if (box && box.id) {
						// als id al bestaat, dan alleen qr genereren
						const createCode = this.createQR(box.id).then((url) => {
							box.imageUrl = url;
							this.boxesPrintList.push(box);
						});
						promisesList.push(createCode);
					} else if(box) {
						const freshBox = {
							id: null,
							flowerType: box.flowerType,
						}
						const createNewBox = createBox(box.flowerType)
							.then((docRef) => {
								freshBox.id = docRef.id
								return this.createQR(docRef.id);
							})
							.then((url) => {
								freshBox.imageUrl = url;
								this.boxesPrintList.push(freshBox);
							});

						promisesList.push(createNewBox);
					}
				});

				return promisesList;
			},

			startPrinting() {
				this.printer.isPrinting = true;
				const createLbl = this.createLabels(this.boxes);
				Promise.all(createLbl).then(() => {
					if (this.printer.timeout) {
						clearTimeout(this.printer.timeout);
					}

					// Start printing (with timeout, so last QR gets printed as well)
					this.printer.timeout = setTimeout(() => {
						this.setStartPosition(this.boxesPrintList.length + 1) % 6;
						// window.print();
					}, 1000);

					// window.addEventListener("afterprint", () => {
					// 	// Callback (Execute only when specified)
					// 	this.printer.isPrinting = false;
					// 	if (this.printStarted) {
					// 		this.printStarted();
					// 	}
					// });
				});
			},
		},
		computed: {
			startCol() {
				return store.state.printerStartCol;
			},
		},
	};
</script>

<style scoped>
	.linelistHolder {
		display: none;
	}

	ul.linelist {
		padding: 0;
		margin: 0;
		display: none;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		grid-column-gap: 4rem;

		&[data-start-col="1"] > *:first-child {
			grid-column-start: 1;
		}

		&[data-start-col="2"] > *:first-child {
			grid-column-start: 2;
		}

		&[data-start-col="3"] > *:first-child {
			grid-column-start: 3;
		}

		&[data-start-col="4"] > *:first-child {
			grid-column-start: 4;
		}

		&[data-start-col="5"] > *:first-child {
			grid-column-start: 5;
		}

		&[data-start-col="6"] > *:first-child {
			grid-column-start: 6;
		}
	}

	.printline {
		list-style: none;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
    font-family: var(--font-print);

		&::before {
			content: "";
			/* border-left: 1px solid gray; */
			position: absolute;
			top: 0;
			left: -2rem;
			height: 100%;
		}

		& > .item {
			display: grid;
			grid-template-areas: "id" "code" "bloemitem";
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;

			&:first-child {
				transform: scale(-1);
			}

			& > .kratid {
				grid-area: id;
				opacity: 0.8;
				font-weight: 900;
				font-size: 0.6em;
			}

			& > .qr {
				grid-area: code;
				width: 100%;

				& > img {
					width: 100%;
				}
			}

			& > .bloemitem {
				grid-area: bloemitem;
				display: flex;
				font-weight: 700;
				white-space: nowrap;
				overflow: hidden;
				width: 100%;
				text-overflow: ellipsis;
				align-items: center;
				justify-content: center;
				font-size: 0.6em;
			}

			& .bloemname {
				&::before {
					content: "-";
					margin: 0 0.2rem;
				}
			}
		}
	}
	.printconfirm {
		position: fixed 0 0 0 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.confirm-dialog {
		width: 600px;
		background: white;
		border-radius: 10px;
		padding: 60px;
		text-align: center;

		& > h3,
		& > h4 {
			font-weight: 400;
			color: var(--color-primary);
		}
	}

	.startposition {
		display: flex;
		justify-content: center;
		margin-bottom: 4rem;

		& > span {
			width: 30px;
			height: 150px;
			background: #f5f5f5;
			margin-left: 5px;
			border: 4px solid #f5f5f5;
			border-radius: 3px;
			transition: all 0.1s ease;

			&:first-child {
				border-radius: 10px 3px 3px 10px;
			}

			&:last-child {
				border-radius: 0 10px 10px 0;
			}

			&:hover,
			&:focus,
			&.s-active {
				&,
				& ~ * {
					background: #dcdcdc;
					border-color: #dcdcdc;
				}
			}

			&.s-active {
				border-color: var(--color-primary);
			}

			&:hover,
			&:focus {
				border-color: var(--color-secondary);
			}
		}
	}
</style>

<style>
	@media print {
		html,
		body,
		.grid,
    main,
		.creator-holder {
			margin: 0 !important;
			padding: 0 !important;
      background: #fff !important;
		}
		#app,
		.page {
			all: unset !important;
		}
		.grid,
		.printconfirm,
    .hide-on-print,
    .page>.header, .bar-container {
			display: none !important;
		}

		.linelistHolder {
			display: block !important;
		}

		ul.linelist {
			display: grid !important;
		}
	}
</style>
