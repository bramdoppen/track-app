<template>
	<BasePage :title="scanResult.id">
		<BoxesList>
			<Box>

				<div class="faketable-table">
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Bloemsoort:</span>
						</div>
						<div class="faketable-content">
							<div>{{ scanResult.data.flowerType.id }} - {{ scanResult.data.flowerType.name }}</div>
							<span class="fakelink" @click="openChangeFlower()" style="margin-top: 10px;">
								<span v-if="!changeFlower">Bloemsoort wijzigen</span>
								<span v-if="changeFlower">Sluit bloemsoort wijzigen</span>
							</span>
							<div class="bloemsoort-veranderen" v-if="changeFlower">
								<select v-model="changeToFlowerType" style="margin-top: 20px;">
									<option v-for="(flower, index) in localDahliaDb" :value="flower.id" :key="index">
										{{ flower.name }}
									</option>
								</select>
								<Button class="button" style="margin-top: 15px;" @click="updateInDB(changeToFlowerType)">Verander bloemsoort</Button>
							</div>
						</div>
					</div>
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Huidige status:</span>
						</div>
						<div class="faketable-content">
							{{ getPlace(scanResult.data.state) }}
						</div>
					</div>
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Huidig wagenonderdeel:</span>
						</div>
						<div class="faketable-content">
							<span v-if="!scanResult.data.belongsToConstructionPart">-</span>
							<span v-if="scanResult.data.belongsToConstructionPart">{{ scanResult.data.belongsToConstructionPart.name }}</span>
						</div>
					</div>
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Corsogroep:</span>
						</div>
						<div class="faketable-content">
							{{ scanResult.data.belongsToCorsoGroup.name }}
						</div>
					</div>
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Aangemaakt:</span>
						</div>
						<div class="faketable-content">
							<span>{{ getDate(scanResult.data.createdOn.seconds) }}</span
							><br />
							<span>Door: {{ scanResult.data.createdBy.name }}</span>
						</div>
					</div>
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Laatste update:</span>
						</div>
						<div class="faketable-content" v-if="scanResult.data.updatedBy && scanResult.data.updatedOn">
							<span>{{ getDate(scanResult.data.updatedOn.seconds) }}</span
							><br />
							<span>Door: {{ scanResult.data.updatedBy.name }}</span>
						</div>
						<div class="faketable-content" v-if="!scanResult.data.updatedBy || !scanResult.data.updatedOn">
							<span>-</span>
						</div>
					</div>
					<div class="faketable-row">
						<div class="faketable-head">
							<span>Logboek:</span>
						</div>
						<div class="faketable-content" v-if="scanResult.data.updateLog" style="margin-top: 10px;">
							<div class="faketable-row logboek-item" v-for="(log, logIndex) in scanResult.data.updateLog" :key="logIndex">
								<span class="logboek-timestamp">{{ getDate(log.updatedOn.seconds) }}</span>
								<span class="logboek-user">{{ log.updatedBy.name }}</span>
								<span class="logboek-message">{{ log.message }}</span>
							</div>
						</div>
					</div>
				</div>
			</Box>
		</BoxesList>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Box from "@/components/base/Box.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";

	export default {
		components: {
			BasePage,
			Box,
			BoxesList,
			Button,
		},
	};
</script>




<script>
import store from '../../store';
import { fb, db } from '../../firebaseConfig.js';

import FrameHeader from '../components/FrameHeader.vue';

export default {
    name: 'SingleScanResult',  
    components: {
        FrameHeader,
    },
    props: ["query"],
    data: () => {
        return {
            scanResult: null,
            scanError: null,
            changeFlower: false,
            changeToFlowerType: null,
            localDahliaDb: {},
        }
    },
    methods: {
        getResult(input) {
            if(!input) {
                this.scanError = "Geen krat opgegeven";
                return;
            }
            db.collection("boxes").doc(input).get().then((doc) => {
                if (doc.exists) {
                    this.scanError = null;
                    this.scanResult = {id: doc.id, data: doc.data()};
                } else {
                    this.scanError = "Krat bestaat niet in Database";
                }
            }).catch(function(error) {
                this.scanError = "Error:", error;
            });
        },
        getPlace(state) {
            return store.state.places[state];
        },
        buildTimeZero(time) {
				if (time < 10) {
					return 0 + "" + time;
				}
				return time;
			},
        getDate(seconds) {
            const dte = new Date(seconds * 1000);
            const months = ["jan", "feb", "maart", "Apr", "mei", "juni", "juli", "aug", "sept", "okt", "nov", "dec"];
            return `${this.buildTimeZero(dte.getDay())} ${months[dte.getMonth()]} ${dte.getFullYear()} - ${this.buildTimeZero(dte.getHours())}:${this.buildTimeZero(
                dte.getMinutes(),
            )}`;
        },
        getFlowers() {
            const that = this;
            db.collection('flowers').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    that.localDahliaDb[doc.id] = {
                        id: doc.id, 
                        name: doc.data().name, 
                        colorHex: doc.data().colorHex,
                        amountPerBox: doc.data().amountPerBox
                    };
                });
            });
        },
        updateInDB(newFlower) {
            newFlower = this.localDahliaDb[newFlower];
            const newFlowerType = {
                id: newFlower.id,
                name: newFlower.name,
                amountPerBox: newFlower.amountPerBox,
                colorHex: newFlower.colorHex,
            }

            const currDate = new Date();
            const currUser = store.state.user;

            // Build update message
            const newUpdateMessage = {
                message: "Bloemtype veranderd naar: " + newFlower.name,
                updatedOn: currDate,
                updatedBy: {
                    id: currUser.id,
                    name: currUser.name,
                }
            }
            db.collection('boxes').doc(this.scanResult.id).update( {
                flowerType: newFlowerType,
                updatedOn: currDate,
                updatedBy: {
                    id: currUser.id,
                    name: currUser.name,
                },
                updateLog: fb.firestore.FieldValue.arrayUnion(newUpdateMessage),
            }).then(() => {
                this.changeFlower = false,
                this.changeToFlowerType = null;
                const scanRes = this.scanResult;
                scanRes.data.flowerType = newFlowerType;
                store.commit("changeSingleScanResult", scanRes)
            })
        },
        openChangeFlower() {
            this.changeFlower = !this.changeFlower;
            if(this.scanResult) {
                this.changeToFlowerType = this.scanResult.data.flowerType.id;
            }
        }
    },
    mounted() {
        this.getResult(this.query)
        this.getFlowers();
    },
}
</script>
