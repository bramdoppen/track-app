<template>
	<div class="form-row">
		<div class="form-item">
			<label>Bloemsoort zoeken:</label>
			<input ref="mainsearch" placeholder="Zoek naar een bloemsoort" v-on:keyup="handleInputChange" />
		</div>
	</div>
</template>

<script>
	import { getAllFromDoc } from "@/functions/firebaseFunctions.js";

	export default {
		name: "SearchFlower",
		props: {
			loading: Boolean,
			result: Array,
		},
		data: function() {
			return {
				timeout: null,
				localDahliaDb: [],
			};
		},
		created() {
			this.updateDahliaDb();
		},
		methods: {
			updateDahliaDb() {
				getAllFromDoc("flowers").then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						this.localDahliaDb[doc.id] = {
							id: doc.id,
							name: doc.data().name,
							colorHex: doc.data().colorHex,
							amountPerBox: doc.data().amountPerBox,
						};
					});
				});
			},
			handleInputChange(e) {
				this.$emit("update:loading", true);
				// debounce alles wat hierin gebeurt.
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {this.searchBloemsoort(e)}, 250);
			},
			searchBloemsoort(input) {
				// data lokaal halen op iedere pagina refresh. Deze gaan haast nooit veranderen.
				const inputValue = input.target.value.toLowerCase();

				// do the search
				this.$emit("update:result", filterIt(this.localDahliaDb, inputValue));
				this.$emit("update:loading", false);

				function filterIt(arr, searchKey) {
					if (searchKey.length === 0) {
						return null;
					} else {
						return arr.filter((obj) => Object.keys(obj).some((key) => obj[key].toLowerCase().includes(searchKey)));
					}
				}
			},
		},
	};
</script>
