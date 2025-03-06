<script setup>
import InvoiceList from '@/components/invoices/InvoiceList.vue';
import FilterByStatus from '@/components/ui/FilterByStatus.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import { computed, ref } from 'vue';
import store from '@/store';
import { onMounted } from 'vue';


const hasInvoices = computed(() => filteredInvoices.value.length > 0);
const invoices = computed(() => store.getters["invoices/invoices"]);
const isLoading = ref(false);
const statusesFilter = ref([]);

const handleFilter = ({ value, checked }) => {
    if (checked) {
        statusesFilter.value = [...statusesFilter.value, value];
    } else {
        statusesFilter.value = statusesFilter.value.filter(f => f !== value);
    }
};

const filteredInvoices = computed(() => {
    if (statusesFilter.value.length === 0) {
        return invoices.value;
    }

    return invoices.value.filter(invoice => statusesFilter.value.includes(invoice.status));
});



onMounted(async () => {
   isLoading.value = true;
   try {
       await store.dispatch("invoices/loadInvoices", { forceRefresh: true });
   } catch (error) {
       console.error("Error fetching invoices:", error);
   }
   isLoading.value = false;
});


</script>

<template>
    <div class="container">
        <section id="header">
            <div class="heading">
                <h1>Invoices</h1>
                <p v-if="filteredInvoices.length === 1"><span class="hide">There is only</span> 1 invoice</p>
                <p v-else class="hide">There are {{ filteredInvoices.length }} total invoices</p>
                <p class="show" v-if="filteredInvoices.length === 0 || filteredInvoices.length > 1">{{ filteredInvoices.length }} invoices</p>
            </div>

            <FilterByStatus @filter="handleFilter" />

            <div class="new-invoice">
                <RouterLink to="/invoices/add" class="btn--purple"><img src="../assets/icon-plus.svg" alt=""> New Invoice</RouterLink>
            </div>
        </section>

        <section id="invoices" v-if="hasInvoices && !isLoading">
            <InvoiceList :invoices="filteredInvoices"/>
        </section>
        <section v-else-if="isLoading">
            <BaseSpinner/>
        </section>
        
        <section class="not-found-invoices" v-else>
            <img src="../assets/illustration-empty.svg" alt="ilustration for empty page">
            <h2>There is nothing here</h2>
            <p>Create an invoice by clicking the new invoice button and get started</p>
        </section>

    </div>
</template>

<style scoped>

#header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 60px;
    margin-bottom: 30px;
}

.heading {
    flex-grow: 2;
}

.heading h1 {
    font-weight: 700;
    font-size: 2.3rem;
}

.heading p {
    padding-top: 10px;
    font-weight: 400;
    font-size: 0.9rem;
}

.filter, .new-invoice {
    flex-grow: 1;
    display: flex;
    justify-content: end;
}

.new-invoice a {
    display: flex;
    text-decoration: none;
    align-items: center;
    gap:15px;
    font-weight: 700;
    padding: 10px 15px 10px 10px;
    border-radius: 30px;
    font-size: 0.75rem;
    color:#fff;
    border: none;
    transition: all .2s;
}

.new-invoice a img {
    background-color: #fff;
    padding: 10px;
    border-radius: 50%;
}

.new-invoice a:hover {
    opacity: 0.75;
}

.not-found-invoices {
    margin-top: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    text-align: center;
    line-height: 1.5;
}

.show {
    display: none;
}

@media screen and (max-width: 900px) {
#header {
    margin-top: 130px;
}
.hide {
    display: none;
}

.show {
    display: block;
}

.heading h1 {
    font-weight: 700;
    font-size: 1rem;
}

}
</style>
