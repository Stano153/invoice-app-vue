<script setup>
import InvoiceForm from '@/components/invoices/InvoiceForm.vue';
import router from '@/router';
import store from '@/store';

const saveData = (data) => {
    store.dispatch('invoices/registerInvoice', data);
    router.replace('/');
}

const props = defineProps(['id']);

</script>

<template>
<div class="container">
    <RouterLink to="/" class="back">
            <img src="../assets/icon-arrow-left.svg" alt="icon arrow back">
            Go back
    </RouterLink>
    <h2>New Invoice</h2>
    <InvoiceForm @save-data="saveData" mode="add" />
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