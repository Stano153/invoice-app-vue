<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
const props = defineProps({
    id: String,
    name: String,
    dueDate: String,
    status: Number,
    items: Array
})

function currentStatus() {
    if(props.status === 0) {
        return "Accepted"
    } else if (props.status === 1) {
        return "Declined"
    } else if (props.status === 2) {
        return "Pending"
    } else if (props.status === 3) {
        return "Draft"
    }
}
const amountDue = computed(() => {
    if (!props.items || props.items.length === 0) return 0;
    
    return props.items.reduce((sum, item) => {
        return sum + (Number(item.itemPrice) * Number(item.itemQty)); 
    }, 0);
});
</script>

<template>
    <li>
        <RouterLink :to="'/invoices/' + id">
            <div class="invoice-item">
                <section class="invoice-box-left">
                    <p class="invoice-number"><span>#</span>{{ id }}</p>
                    <p class="invoice-due">{{ dueDate }}</p>
                    <p class="invoice-name">{{ name }}</p>
                </section>

                <section class="invoice-box-right">
                    <p class="invoice-value">{{ amountDue }}€</p>
                    <p :class="['invoice-status', { 'accepted': status === 0, 'pending': status === 2, 'declined': status === 1, 'draft': status === 3 }]">{{ currentStatus() }}</p>
                    <img src="../../assets/icon-arrow-right.svg" alt="Icon arrow right">
                </section>
            </div>
        </RouterLink>
    </li>
</template>

<style scoped>
a {
    text-decoration: none;
}

li {
    list-style: none;
    margin-bottom: 15px;
}

img {
    object-fit: contain;
}

.invoice-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--background-box-color);
    padding: 20px;
    border-radius: 10px;
    transition: all .2s;
    border: 1px solid var(--background-box-color);
    font-size: 0.8rem;
}

.invoice-item:hover {
    border: 1px solid var(--button-color-primary);

}

.invoice-box-left, .invoice-box-right {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 15px;
}

.invoice-number {
    color: var(--font-color-primary);
    font-weight: 600;
    font-size: 0.8rem;
}

.invoice-item span {
    color: var(--font-color-tertiary);
}

.invoice-due, .invoice-name {
    color:var(--font-color-secondary);
}

.invoice-value {
    font-weight: 700;
    font-size: 1rem;
    color: var(--font-color-primary);
}




@media screen and (max-width: 700px) {
    .invoice-box-left, .invoice-box-right {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 15px;
}
.invoice-box-left {
    align-items: start;
}

.invoice-box-right {
    align-items: end;
}
img {
    display: none;
}
}

</style>