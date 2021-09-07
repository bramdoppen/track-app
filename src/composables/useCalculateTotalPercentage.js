import { ref, computed } from "vue";

export default function useCalculateTotalPercentage(_allParts) {
  const allParts = ref(_allParts);
  const calculatedFlowers = ref(0);
  const processedFlowers = ref(0);
  const correctionFlowers = ref(0);
  const correctionBoxes = ref(0);

  allParts.value.forEach(part => {
    if(part.calculatedTotalAmountFlowers) {
      calculatedFlowers.value += parseFloat(part.calculatedTotalAmountFlowers);
    }
    if(part.processedTotalAmountFlowers) {
      processedFlowers.value += part.processedTotalAmountFlowers;
    }
    if(part.correctionTotalAmountFlowers) {
      correctionFlowers.value += part.correctionTotalAmountFlowers;
    }
    if(part.correctionTotalAmountBoxes) {
      correctionBoxes.value += parseFloat(part.correctionTotalAmountBoxes);
    }
  });

  const calculatedTotal = computed(() => {
    return parseFloat((processedFlowers.value / (calculatedFlowers.value + correctionFlowers.value)) * 100).toFixed(2);
  })

  return {
    calculatedTotal,
    calculatedFlowers,
    processedFlowers,
    correctionFlowers,
    correctionBoxes,
  };
}