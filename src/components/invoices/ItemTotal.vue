<script setup>
import { computed } from "vue";

const props = defineProps({
  item: Object
});
const totalWithCurrency = computed(() => {
  return `${(props.item.itemQty * props.item.itemPrice).toFixed(2)} €`;
});
</script>

<template>
    <input type="text" name="item_total" :value="totalWithCurrency" disabled>
</template>
