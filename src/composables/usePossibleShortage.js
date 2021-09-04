import { ref, computed } from "vue";

export default function useCalculatePossibleShortage(_allParts) {
  const allParts = ref(_allParts);
  const calculatedFlowers = ref(0);
  const processedFlowers = ref(0);

  allParts.value.forEach(part => {
    calculatedFlowers.value += part.data.calculatedTotalAmountFlowers;
    processedFlowers.value += part.data.processedTotalAmountFlowers;
  });

  const calculatedTotal = computed(() => {
    return parseFloat((processedFlowers.value / calculatedFlowers.value) * 100).toFixed(2);
  })

  return {
    calculatedTotal
  };
}