<script setup>
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import GeneratePdf from '@/components/invoices/GeneratePdf.vue';
import modal from '@/components/ui/BaseModal.vue';
import { computed, onMounted, ref} from 'vue';
import {useStore } from 'vuex';
import { useToast } from "vue-toastification";
import router from '@/router';
import { RouterLink } from 'vue-router';
const toast = useToast();
import config from "@/config";
const store = useStore();
const props = defineProps(['id'])
const isLoading = ref(false);
const invoices = computed(() => store.getters["invoices/invoices"]);

const showModal = ref(false);
const userId = store.getters.userId;
const token = store.getters.token;

const selectedInvoice = computed(() => {
    return invoices.value.find(invoice => String(invoice.id) === String(props.id));
});


const amountDue = computed(() => {
    if (!selectedInvoice.value || !selectedInvoice.value.items) return 0;
    
    return selectedInvoice.value.items.reduce((sum, item) => {
        return sum + (item.itemPrice * item.itemQty);
    }, 0);
});

function currentStatus() {
    if(selectedInvoice.value.status === 0) {
        return "Accepted"
    } else if (selectedInvoice.value.status === 1) {
        return "Declined"
    } else if (selectedInvoice.value.status === 2) {
        return "Pending"
    } else if (selectedInvoice.value.status === 3) {
        return "Draft"
    }
}

const deleteInvoice = async () => {
    if (!selectedInvoice.value) {
        toast.error("Invoice not found!");
        return;
    }

    const firebaseId = selectedInvoice.value.firebaseId;
    if (!firebaseId) {
        toast.error("Invalid invoice ID!");
        return;
    }
  
    

    try {
        const response = await fetch(
            `${config.databaseUrl}/invoices/${userId}/${firebaseId}.json?auth=${token}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            throw new Error("Failed to delete invoice");
        }

        toast.success("Invoice deleted successfully!");
        router.push("/");
    } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Invoice could not be deleted");
    }
};


const updateStatus = async (value) => {
    if (!selectedInvoice.value) {
        toast.error("Invoice not found!");
        return;
    }

    const firebaseId = selectedInvoice.value.firebaseId;
    if (!firebaseId) {
        toast.error("Invalid invoice ID!");
        return;
    }

    try {
        const response = await fetch(
            `${config.databaseUrl}/invoices/${userId}/${firebaseId}.json?auth=${token}`,
            {
                method: "PATCH",
                body: JSON.stringify({ status: value }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update invoice status");
        }
        store.dispatch("invoices/loadInvoices");
        if(value === 0) {
            toast.success("Invoice marked as Paid!");
        } else if(value === 1) {
            toast.error("Invoice marked as Not Paid!");
        }
    } catch (error) {
        console.error("Error updating invoice:", error);
        toast.error("Failed to update invoice status");
    }
};

onMounted(async () => {

  isLoading.value = true;
  try {
    await store.dispatch("invoices/loadInvoices");
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
  isLoading.value = false;
});

const show = ref(false);
const isRotation = ref(false);

const openStatus = () => {
    show.value = !show.value;
    isRotation.value = !isRotation.value
}

const toggleModal = () => {
      showModal.value = !showModal.value;
    }

</script>

<template>
    <div class="container">
        <RouterLink to="/" class="back">
            <img src="../assets/icon-arrow-left.svg" alt="icon arrow back">
            Go back
        </RouterLink>
        <div v-if="isLoading">
            <BaseSpinner/>
        </div>
        <div v-else-if="selectedInvoice">
            <GeneratePdf :invoice="selectedInvoice" :amountDue="amountDue" v-if="selectedInvoice.status === 0 || selectedInvoice.status === 1 || selectedInvoice.status === 2" />
        <div class="invoice-header">
            <section :class="['header-left', {'full': selectedInvoice.status === 3}]">
                <p>Status</p>
                <p :class="['invoice-status', { 'accepted': selectedInvoice.status === 0, 'pending': selectedInvoice.status === 2, 'declined': selectedInvoice.status === 1, 'draft': selectedInvoice.status === 3 }]">{{ currentStatus() }}</p>
            </section>
            <section class="header-right">
                <RouterLink class="btn btn--light-gray invoice-edit hide" :to="'/invoices/edit/' + props.id">Edit</RouterLink>
                <button class="btn btn--error invoice-delete hide" @click="toggleModal">Delete</button>
                <div class="status" v-if="selectedInvoice.status !== 3">
                    <button @click="openStatus" class="btn btn--purple"><span class="hide">Change</span> Status <span><img :class="['status__arrow',{'status__arrow--rotation': isRotation}]" src="../assets/icon-arrow-down-white.svg" alt="icon arrow down"></span></button>
                    <transition name="down">
                        <div class="status-popup" v-if="show">
                            <button :class="['accepted-btn', {'active-border-accepted': selectedInvoice.status === 0}]" @click="updateStatus(0)">Paid</button>
                            <button :class="['declined-btn',{'active-border-declined': selectedInvoice.status === 1}]" @click="updateStatus(1)" >Not Paid</button>
                            <button :class="['pending-btn', {'active-border-pending': selectedInvoice.status === 2}]" @click="updateStatus(2)" >Pending</button>
                        </div>
                    </transition>
                </div>
            </section>
        </div>

        <div class="invoice-body">
            <div class="invoice-body__from">
                <section class="section--id">
                    <p class="invoice-number"><span>#</span>{{ selectedInvoice.id }}</p>
                    <p>{{ selectedInvoice.description }}</p>
                </section>
                <section class="section--address">
                    <p>{{ selectedInvoice.address.street }}</p>
                    <p>{{ selectedInvoice.address.city }}</p>
                    <p>{{ selectedInvoice.address.postalCode }}</p>
                    <p>{{ selectedInvoice.address.country }}</p>
                </section>
            </div>
            <div class="invoice-body__to">
                <section class="section--date">
                    <p>Invoice Date</p>
                    <p class="important">{{ selectedInvoice.invoiceDate }}</p>
                    <p>Payment Due</p>
                    <p class="important">{{ selectedInvoice.paymentDue }}</p>
                </section>
                <section class="section--to">
                    <p>Bill To</p>
                    <p class="important">{{ selectedInvoice.billTo.name }}</p>
                    <p>{{ selectedInvoice.billTo.address.street }}</p>
                    <p>{{ selectedInvoice.billTo.address.city }}</p>
                    <p>{{ selectedInvoice.billTo.address.postalCode }}</p>
                    <p>{{ selectedInvoice.billTo.address.country }}</p>
                </section>
                <section class="section--mail-to">
                    <p>Sent to</p>
                    <p class="important">{{ selectedInvoice.sentTo }}</p>
                </section>
            </div>

            <div class="invoice-body__items">
                <div class="items-header hide">
                    <p>Item Name</p>
                    <p>QTY.</p>
                    <p>Price</p>
                    <p>Total</p>
                </div>
                <div class="items-list" v-for="item in selectedInvoice.items" :key="item.name">
                    <p>{{ item.itemName }}</p>
                    <p class="show">{{ item.itemQty }} x {{ item.itemPrice }}€</p>
                    <p class="hide">{{ item.itemQty }}</p>
                    <p class="hide">{{ item.itemPrice }} €</p>
                    <p>{{ item.itemPrice * item.itemQty }} €</p>
                </div>
                <div class="items-amount">
                    <p>Amount Due</p>
                    <p>{{ amountDue }}€</p>
                </div>
            </div>
        </div>
        <div class="mobile_buttons">
            <RouterLink class="btn btn--light-gray invoice-edit" :to="'/invoices/edit/' + props.id">Edit</RouterLink>
            <button class="btn btn--error invoice-delete" @click="toggleModal">Delete</button>
    </div>
    </div>

    <transition name="modal">
      <modal v-if="showModal">
        <template v-slot:header>
          <h3>Confirm Deletion</h3>
        </template>
        <template v-slot:body>
          <p>
            Are you sure you want to delete invoice #{{ selectedInvoice.id }}? This
            action cannot be undone.
          </p>
        </template>
        <template v-slot:footer>
          <button class="btn btn--light-gray" @click="toggleModal">
            Close
          </button>
          <button class="btn btn--error" @click="deleteInvoice">Delete</button>
        </template>
      </modal>
    </transition>
    </div>
    

   
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.container {
    margin-top: 60px;
}

.back {
    color:var(--font-color-primary);
    text-decoration: none;
    font-weight: 700;
    transition: all .2s;
    font-size: 0.8rem;
}

.back:hover {
    color: var(--button-color-primary);
}

.back img {
    object-fit: contain;
    margin-right: 10px;
}

.invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--background-box-color);
    padding: 25px;
    border-radius: 10px;
    margin: 15px 0;
    border: 1px solid var(--background-box-color);
    font-size: 0.8rem;
    color:var(--font-color-secondary);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header-right {
    display: flex;
    gap: 10px;
}



/*INVOICE BODY */

.invoice-body {
    color:var(--font-color-secondary);
    background-color: var(--background-box-color);
    padding: 25px;
    border-radius: 10px;
    margin: 15px 0;
    border: 1px solid var(--background-box-color);
    font-size: 0.8rem;
    overflow: hidden;
}

.invoice-body p {
    line-height: 2;
}

.invoice-number {
    color: var(--font-color-primary);
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 0.9rem;
}

.invoice-number span {
    color: var(--font-color-tertiary);
}

.invoice-body__from {
    display: flex;
    justify-content: space-between;
}

.invoice-body__to {
    margin: 25px 0;
    display: flex;
    flex-wrap: wrap;
}

.section--date {
    flex: 1;
}

.section--to {
    flex: 1;
}

.section--mail-to {
    flex: 1;;
}

.important {
    font-weight: 700;
    font-size: 0.9rem;
    color:var(--font-color-primary);
    margin: 15px 0;
}

.invoice-body__items {
    background-color: var(--table-bg-color-primary);
    border-radius: 10px;
    font-size: 0.8rem;
    color:var(--font-color-secondary);
    overflow: hidden;
}

.items-header, .items-list {
    display: flex;
    margin: 25px;
}

.items-list {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr; 
}

.items-header p {
    flex-grow: 1;
    text-align: right;
}

.items-header p:first-child {
    flex-grow: 2;
    text-align: left;
}

.items-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--table-bg-color-secondary);
    border-radius: 0 0 10px 10px;
    padding: 25px;
}

.items-amount p {
    font-weight: 600;
    color: var(--table-color);
}

.items-amount p:last-child {
    font-weight: 700;
    font-size: 1.2rem;
}

.items-list p {
    flex-grow: 1;
    text-align: right;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--font-color-primary);
}

.items-list p:first-child {
    flex-grow: 2;
    text-align: left;
}
.mobile_buttons {
    display: none;
}

.show {
    display: none;
}

/*STATUS DROPDOWN */


.status__arrow {
    margin-left: 5px;
    transition: transform .3s ease 0s;
}

.status__arrow--rotation {
    transform: rotate(180deg);
}

.status-popup {
    background-color: var(--background-box-color);
    padding: 15px;
    margin-top: 5px;
    border-radius: 10px;
    box-shadow: 0 7px 29px 0 rgba(73, 73, 94, .2);
    position: absolute;
    min-width: 160px;
    z-index: 2;
}



.accepted-btn {
  color: var(--status-color-accepted);
  background-color: var(--status-bg-color-accepted);
  border: 1px solid var(--status-bg-color-accepted);
  margin-bottom: 8px;
}

.active-border-accepted {
    border: 1px solid var(--status-color-accepted);
}

.pending-btn {
  color: var(--status-color-pending);
  background-color: var(--status-bg-color-pending);
  border: 1px solid var(--status-bg-color-pending);

}

.active-border-pending {
    border: 1px solid var(--status-color-pending);
}

.declined-btn {
  color: var(--status-color-declined);
  background-color: var(--status-bg-color-declined);
  border: 1px solid var(--status-bg-color-declined);
  margin-bottom: 8px;
}

.active-border-declined {
    border: 1px solid var(--status-color-declined);
}

.status-popup button {
    width: 100%;
    display: block;
    padding: 8px 0;
    font-weight: 700;
    border-radius: 10px;
}

.down-enter-from {
 opacity: 0;
 transform: translateY(-10px);
}

.down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.down-leave-from,
.down-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.down-enter-active {
  transition: all 0.3s ease-out;
}

.down-leave-active {
  transition: all 0.3s ease-in;

}

@media screen and (max-width: 900px) {
.container {
    margin-top: 130px;
    margin-bottom: 30px;
}

.section--mail-to {
    flex-basis: 100%;
}

.show {
    display: block;
}

.hide {
    display: none;
}

.mobile_buttons {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px 10px;
    background-color: var(--background-box-color);
    box-shadow: 0 7px 29px 0 rgba(73, 73, 94, .2);
    text-align: center;
}

.mobile_buttons .invoice-edit {
    margin-right: 10px;
}

.items-list {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr; 
}

.full {
    width: 100%;
    justify-content: space-between;
}

.status-popup {
    margin-left: -55px;
}
}

</style>