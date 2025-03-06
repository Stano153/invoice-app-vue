<script setup>
import InvoiceForm from '@/components/invoices/InvoiceForm.vue';
import router from '@/router';
import store from '@/store';
import { computed } from 'vue';

const props = defineProps(['id']);
const invoices = computed(() => store.getters["invoices/invoices"]);
const selectedInvoice = computed(() => {
    if (!invoices.value || invoices.value.length === 0) return undefined;
    return invoices.value.find(invoice => String(invoice.id) === String(props.id));
});


const updateExistingInvoice = async (data) => {
    if (!selectedInvoice.value) {
        console.error("Invoice not found");
        return;
    }

    const firebaseId = selectedInvoice.value.firebaseId;
    try {
        await store.dispatch('invoices/updateInvoice', { firebaseId, updatedData: data });
        router.replace('/invoices/' + props.id);
    } catch (error) {
        console.error(error);
    }
};

</script>

<template>
<div class="container">
    <RouterLink :to="'/invoices/' + props.id" class="back">
            <img src="../assets/icon-arrow-left.svg" alt="icon arrow back">
            Go back
    </RouterLink>
    <h2>Edit #{{ props.id }}</h2>
    <InvoiceForm @save-data="updateExistingInvoice" :id="props.id" mode="edit" />
</div>

</template>

<style scoped>
.container {
    margin-top: 60px;
}

h2 {
    margin-top: 20px;
}

.back {
    color:var(--font-color-primary);
    text-decoration: none;
    font-weight: 700;
    transition: all .2s;
    font-size: 0.8rem;
    margin-bottom: 20px;
}

.back:hover {
    color: var(--button-color-primary);
}

.back img {
    object-fit: contain;
    margin-right: 10px;
}

@media screen and (max-width: 900px) {
.container {
    margin-top: 130px;
}
}
</style>