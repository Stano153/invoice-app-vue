<script setup>
import { ref, reactive } from 'vue';
import { useToast } from "vue-toastification";
import { computed } from 'vue';
import ItemTotal from './ItemTotal.vue';
import store from '@/store';
import { onMounted } from 'vue';

const toast = useToast();
const emit = defineEmits(['save-data'])
const props = defineProps(['id', 'mode'])
const invoices = computed(() => store.getters["invoices/invoices"]);
const selectedInvoice = computed(() => {
    return invoices.value.find(invoice => String(invoice.id) === String(props.id));
});
const dateMain = ref(new Date());

const mode = ref(props.mode)
const invoiceDate = ref(
        new Date().toLocaleDateString("sk-SK", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
);
    
const billFrom = reactive({
    streetAddress: '',
    city: '',
    postCode: '',
    country: ''
});
    
const billTo = reactive({
    clientName: '',
    clientEmail: '',
    streetAddress: '',
    city: '',
    postCode: '',
    country: '',
    paymentTerms: ''
});
    
const invoiceStatus = ref(null);
const projectDescription = ref('');
const paymentDueDays = ref(1);
const items = ref([]);
const isValidForm = ref(true);

const invalidInput = reactive({
    fromStreet: true,
    fromCity: true,
    fromPostCode: true,
    fromCountry: true,
    toName: true,
    toEmail: true,
    toStreet: true,
    toCity: true,
    toPostCode: true,
    toCountry: true,
    toTerms: true,
    Items: true,
    projectDescription: true
});

onMounted(async () => {
    await store.dispatch("invoices/loadInvoices");
    loadInvoiceData();
});

const loadInvoiceData = () => {
    if (mode.value === 'edit' && selectedInvoice.value) {
        const invoice = selectedInvoice.value;

        billFrom.streetAddress = invoice.address?.street || '';
        billFrom.city = invoice.address?.city || '';
        billFrom.postCode = invoice.address?.postalCode || '';
        billFrom.country = invoice.address?.country || '';

        billTo.clientName = invoice.billTo?.name || '';
        billTo.clientEmail = invoice.sentTo || '';
        billTo.streetAddress = invoice.billTo?.address?.street || '';
        billTo.city = invoice.billTo?.address?.city || '';
        billTo.postCode = invoice.billTo?.address?.postalCode || '';
        billTo.country = invoice.billTo?.address?.country || '';

        invoiceDate.value = invoice.invoiceDate;
        invoiceStatus.value = invoice.status || 2;
        projectDescription.value = invoice.description || '';
        items.value = invoice.items || [];
        paymentDueDays.value = invoice.paymentDueDays || 1;
        dateMain.value = new Date(invoice.dateValue);
    }
};

if (mode.value === 'add') {
    billFrom.streetAddress = '';
    billFrom.city = '';
    billFrom.postCode = '';
    billFrom.country = '';  

    billTo.clientName = '';
    billTo.clientEmail = '';
    billTo.streetAddress = '';
    billTo.city = '';
    billTo.postCode = '';
    billTo.country = '';
    
    invoiceStatus.value = 2;
    projectDescription.value = '';
    items.value = [];
    dateMain.value = new Date();
}

    
function addDaysToInvoice(date, days) {
    let currentDate = new Date(date);

    currentDate.setDate(currentDate.getDate() + parseInt(days));

    billTo.paymentTerms = currentDate.toLocaleDateString("sk-SK", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

}
const resetForm = () => {
    billFrom.streetAddress = '';
    billFrom.city = '';
    billFrom.postCode = '';
    billFrom.country = '';  
    
    billTo.clientName = '';
    billTo.clientEmail = '';
    billTo.streetAddress = '';
    billTo.city = '';
    billTo.postCode = '';
    billTo.country = '';
    paymentDueDays.value = 1;

    invoiceStatus.value = 2;
    projectDescription.value = '';
    items.value = []
};


const addItem = () => {
    const newItemInstance = {
        itemName: '',
        itemQty: 0,
        itemPrice: 0,
    };
    if(!invalidInput.Items) {
        invalidInput.Items = true;
    }
    items.value.push(newItemInstance); 
};

const removeItem = (index) => {
    items.value.splice(index, 1)
}

const saveInvoice = () => {
    invoiceStatus.value = 2;
}

const saveDraft = () => {
    invoiceStatus.value = 3;
}

const validateForm = () => {
    isValidForm.value = true;
    if(items.value.length === 0) {
        invalidInput.Items = false;
        isValidForm.value = false;
    }
    if(billFrom.streetAddress === '') {
        invalidInput.fromStreet = false;
        isValidForm.value = false;

    }
    if(billFrom.city === '') {
        invalidInput.fromCity = false;
        isValidForm.value = false;

    }
    if(billFrom.country === '') {
        invalidInput.fromCountry = false;
        isValidForm.value = false;

    }
    if(billFrom.postCode === '') {
        invalidInput.fromPostCode = false;
        isValidForm.value = false;

    }
    if(billFrom.streetAddress === '') {
        invalidInput.fromStreet = false;
        isValidForm.value = false;

    }
    if(billTo.streetAddress === '') {
        invalidInput.toStreet = false;
        isValidForm.value = false;

    }
    if(billTo.postCode === '') {
        invalidInput.toPostCode = false;
        isValidForm.value = false;

    }
    if(billTo.city === '') {
        invalidInput.toCity = false;
        isValidForm.value = false;

    }
    if(billTo.country === '') {
        invalidInput.toCountry = false;
        isValidForm.value = false;

    }
    if(billTo.clientName === '') {
        invalidInput.toName = false;
        isValidForm.value = false;

    }
    if(billTo.clientEmail === '' || !(billTo.clientEmail.includes('@') && billTo.clientEmail.includes('.')) ) {
        invalidInput.toEmail = false;
        isValidForm.value = false;

    }
    if(projectDescription.value === '') {
        invalidInput.projectDescription = false;
        isValidForm.value = false;
    }
}

const submitForm = () => {
    isValidForm.value = true;
    if(invoiceStatus.value === 2) {
        validateForm();
    }

    if(isValidForm.value === false) {
        toast.error('Some input are empty or filled with wrong data', {
            timeout:3000
        })
        return;
    }

    let invoiceDateToUse = mode.value === 'edit' ? selectedInvoice.value.dateValue : dateMain.value;
    addDaysToInvoice(invoiceDateToUse, paymentDueDays.value);
    const data = {
        status: invoiceStatus.value,
        description: projectDescription.value,
        address: {
            street: billFrom.streetAddress,
            city: billFrom.city,
            postalCode: billFrom.postCode,
            country: billFrom.country
        },
        invoiceDate: invoiceDate.value,
        paymentDue: billTo.paymentTerms,
        paymentDueDays: paymentDueDays.value,
        dateValue: invoiceDateToUse,
        billTo: {
            name: billTo.clientName,
            address: {
                street: billTo.streetAddress,
                city: billTo.city,
                postalCode: billTo.postCode,
                country: billTo.country
            }
        },
        items: [...items.value],
        sentTo: billTo.clientEmail,
    }
    emit('save-data', data);
    toast.success('Invoice was successfuly created!', {
        timeout:3000
    })
}

</script>

<template>
<form @submit.prevent="submitForm" id="invoice-form">
    <fieldset class="bill__from">
    <legend class="fieldset__legend">Bill from</legend>
    <div class="form-control">
        <label for="street_address">Street Address</label>
        <input type="text" id="street_address" v-model.trim="billFrom.streetAddress" :class="{'invalid': !invalidInput.fromStreet}" @input="invalidInput.fromStreet = !!billFrom.streetAddress" >
        <p v-if="!invalidInput.fromStreet" class="invalid-label">This field is required!</p>
    </div>
    <div class="flex__items">
        <div class="form-control">
            <label for="city">City</label>
            <input type="text" id="city" v-model.trim="billFrom.city" :class="{'invalid': !invalidInput.fromCity}" @input="invalidInput.fromCity = !!billFrom.city">
            <p v-if="!invalidInput.fromCity" class="invalid-label">This field is required!</p>

        </div>
        <div class="form-control">
            <label for="post_code">Post Code</label>
            <input type="number" v-model.trim="billFrom.postCode" id="post_code" :class="{'invalid': !invalidInput.fromPostCode}" @input="invalidInput.fromPostCode = !!billFrom.postCode">
            <p v-if="!invalidInput.fromPostCode" class="invalid-label">This field is required!</p>

        </div>
        <div class="form-control">
            <label for="country">Country</label>
            <input type="text" v-model.trim="billFrom.country" id="country" :class="{'invalid': !invalidInput.fromCountry}" @input="invalidInput.fromCountry = !!billFrom.country">
            <p v-if="!invalidInput.fromCountry" class="invalid-label">This field is required!</p>

        </div>
    </div>
    </fieldset>
<fieldset class="bill__to">
    <legend class="fieldset__legend">Bill to</legend>
    <div class="form-control">
        <label for="client_name">Client's Name</label>
        <input type="text" v-model.trim="billTo.clientName" id="client_name" :class="{'invalid': !invalidInput.toName}" @input="invalidInput.toName = !!billTo.clientName">
        <p v-if="!invalidInput.toName" class="invalid-label">This field is required!</p>

    </div>
    <div class="form-control">
        <label for="client_email">Client's Email</label>
        <input type="text" v-model.trim="billTo.clientEmail" id="client_email" :class="{'invalid': !invalidInput.toEmail}" @input="invalidInput.toEmail = !!billTo.clientEmail">
        <p v-if="!invalidInput.toEmail" class="invalid-label">Please enter a valid email!</p>

    </div>
    <div class="form-control">
        <label for="street_address--client">Street Address</label>
        <input type="text" v-model.trim="billTo.streetAddress" id="street_address--client" :class="{'invalid': !invalidInput.toStreet}" @input="invalidInput.toStreet = !!billTo.streetAddress">
        <p v-if="!invalidInput.toStreet" class="invalid-label">This field is required!</p>

    </div>
    <div class="flex__items">
        <div class="form-control">
            <label for="city_client">City</label>
            <input type="text" v-model.trim="billTo.city" id="city_client" :class="{'invalid': !invalidInput.toCity}" @input="invalidInput.toCity = !!billTo.city">
            <p v-if="!invalidInput.toCity" class="invalid-label">This field is required!</p>

        </div>
        <div class="form-control">
            <label for="post_code_client">Post Code</label>
            <input type="number" v-model.trim="billTo.postCode" id="post_code_client" :class="{'invalid': !invalidInput.toPostCode}" @input="invalidInput.toPostCode = !!billTo.postCode">
            <p v-if="!invalidInput.toPostCode" class="invalid-label">This field is required!</p>

        </div>
        <div class="form-control">
            <label for="country_client">Country</label>
            <input type="text" v-model.trim="billTo.country" id="country_client" :class="{'invalid': !invalidInput.toCountry}" @input="invalidInput.toCountry = !!billTo.country">
            <p v-if="!invalidInput.toCountry" class="invalid-label">This field is required!</p>

        </div>
    </div>
    <div class="flex__items">
        <div>
            <label for="invoiceDate">Invoice Date</label>
            <input
                type="text"
                id="invoiceDate"
                v-model="invoiceDate"
                disabled
            />
        </div>
        <div>
            <label for="payment_terms">Payment terms</label>
            <select id="payment_terms" v-model="paymentDueDays">
                <option value="1">Net 1 Day</option>
                <option value="7">Net 7 Day</option>
                <option value="14">Net 14 Day</option>
                <option value="30">Net 30 Day</option>
            </select>
        </div>
    </div>
    <div class="form-control">
        <label for="project_desc">Project description</label>
        <input type="text" v-model.trim="projectDescription" id="project_desc" :class="{'invalid': !invalidInput.projectDescription}" @input="invalidInput.projectDescription = !!projectDescription">
        <p v-if="!invalidInput.projectDescription" class="invalid-label">This field is required!</p>

    </div>
    <div>
        <h3>Item List</h3>

        <ul v-if="items.length > 0">
            <li v-for="(item, index) in items" class="items" :key="index">
                    <div>
                        <label for="item__name">Item Name</label>
                        <input type="text" name="item_name" class="item__name" v-model.trim="item.itemName">
                    </div>
                    <div>
                        <label for="item__qty">QTY.</label>
                        <input type="number" name="item_qty" class="item__qty" v-model="item.itemQty">
                    </div>
                    <div>
                        <label for="item__price">Price</label>
                        <input type="number" name="item_price" class="item__price" v-model="item.itemPrice" step="any">
                    </div>
                    <div>
                        <label for="item__total">Total</label>
                        <ItemTotal :item="item" />
                    </div>
                    <button type="button" @click="removeItem(index)" class="remove">
                        <img src="../../assets/icon-delete.svg" alt="delete item icon">
                    </button>
                
            </li>
        </ul>
        <button class="btn btn--light-gray new-item" @click="addItem" type="button"><img src="../../assets/icon-plus.svg" alt=""> Add New Item</button>
        <p v-if="!invalidInput.Items" class="invalid-label">Please add at least one item!</p>
    </div>
</fieldset>
<div class="buttons">
    <button class="btn btn--error" @click="resetForm" type="button">Reset</button>
    <div>
        <button class="btn btn--light-gray draft" @click="saveDraft">Save Draft</button>
        <button class="btn btn--purple" @click="saveInvoice" type="submit">Save</button>
    </div>
</div>
</form>
</template>

<style scoped>
#invoice-form {
    padding: 20px 0;
}
.fieldset__legend {
    font-size: .7rem;
    font-weight: 700;
    color: var(--button-color-primary);
    margin-bottom: 20px;
}

fieldset {
    border: none;
    margin-top: 30px;
}

label {
    color: var(--font-color-secondary);
    font-size: .7rem;
}

input, select {
    outline: none;
    border: 1px solid var(--border-color-primary);
    background-color: var(--background-box-color);
    padding: 15px;
    width: 100%;
    margin: 10px 0 15px 0;
    transition: .2s;
    color: inherit;
    border-radius: 5px;
}

select {
    appearance: none;
    position: relative;
    background-image: url(../../assets/icon-arrow-down.svg);
    background-repeat: no-repeat;
    background-position: top 50% right 15px;
    font-weight: 700;
}

#invoiceDate {
    font-weight: 700;
    appearance: none;
    position: relative;
    background-image: url(../../assets/icon-calendar.6005c53d.svg);
    background-repeat: no-repeat;
    background-position: top 50% right 15px;
    background-color: var(--background-color);
    color: var(--font-color-secondary);
}

input:focus, select:focus {
    border: 1px solid var(--button-color-primary);
}

.flex__items {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}

.flex__items div{
    flex: 1;
}

.buttons {
    display: flex;
    justify-content: space-between;
}

.draft {
    margin-right: 10px;
}

.items {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    gap: 10px;
}

.items div{
    flex: 1;
}

.items div:first-child {
    flex: 2;
}

.new-item {
    width: 100%;
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.remove {
    background: transparent;
    border: none;
    transition: .2s;
    margin-top: 12px;
}

.remove:hover {
    opacity: 0.7;
}

.invalid, .invalid:focus {
    border: 1px solid var(--error-color);
    background-color: rgba(255, 107, 107, 0.0571);
}

.invalid-label {
    color:var(--error-color);
    margin-bottom:8px;
    margin-top: 5px;
    font-size: 12px;
}


@media screen and (max-width: 900px) {
    .items div:first-child {
    flex-basis: 100%;
}

.items input {
    margin: 5px 0;
}

.items div {
    padding: 5px 0;
}

}


</style>