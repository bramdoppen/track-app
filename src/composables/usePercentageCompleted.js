import { ref, computed } from "vue";

export default function usePercentageCompleted(_item) {
  const item = ref(_item);

  const calculatedPercentage = computed(() => {
    const calculated = item.value.calculatedTotalAmountFlowers || 0;
    const processed = item.value.processedTotalAmountFlowers || 0;
    return parseInt((processed / calculated) * 100);
  });

  return {
    calculatedPercentage
  };
}