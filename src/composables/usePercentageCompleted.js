import { ref, computed } from "vue";

export default function usePercentageCompleted(_item) {
  const item = ref(_item);

  const calculatedPercentage = computed(() => {
    const calculatedFlowers = item.value.calculatedTotalAmountFlowers || 0;
    const processedFlowers = item.value.processedTotalAmountFlowers || 0;
    const correctionFlowers = item.value.correctionTotalAmountFlowers || 0;
    return parseInt((processedFlowers / (calculatedFlowers + correctionFlowers)) * 100);
  });

  return {
    calculatedPercentage
  };
}