<script setup>
import InvoiceItem from './InvoiceItem.vue';
import { computed } from 'vue';
import store from '@/store';

const props = defineProps(['invoices'])
const hasInvoices = computed(() => store.getters["invoices/hasInvoices"]);

</script>

<template>

<ul v-if="hasInvoices" >
    <InvoiceItem v-for="inc in props.invoices" :key="inc.id" :id="inc.id" :name="inc.billTo.name" :value="inc.amountDue" :dueDate="inc.paymentDue" :status="inc.status" :items="inc.items" />
    
</ul>

</template>

