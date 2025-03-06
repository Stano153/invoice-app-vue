<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isLoading = ref(false);

const invoices = computed(() => store.getters['invoices/invoices'] || []);

const statusLabels = {
    0: "Accepted",
    1: "Declined",
    2: "Pending"
};

const invoiceStats = computed(() => {
    const stats = {
        Accepted: { count: 0, total: 0 },
        Declined: { count: 0, total: 0 },
        Pending: { count: 0, total: 0 }
    };

    invoices.value.forEach(invoice => {
        const status = statusLabels[invoice.status]; 
        if (stats[status]) {
            stats[status].count += 1;
            stats[status].total += (Array.isArray(invoice.items) 
                ? invoice.items.reduce((sum, item) => sum + (item.itemPrice * item.itemQty), 0) 
                : 0);
        }
    });
    return stats;
});

const barChartSeries = computed(() => [
    {
        name: "Total Worth (€)",
        data: [
            invoiceStats.value.Pending.total,
            invoiceStats.value.Declined.total,
            invoiceStats.value.Accepted.total
        ]
    },
    {
        name: "Invoice Count",
        data: [
            invoiceStats.value.Pending.count,
            invoiceStats.value.Declined.count,
            invoiceStats.value.Accepted.count
        ]
    }
]);

const barChartOptions = {
    chart: { type: 'bar', height: 350, background: 'transparent' },
    xaxis: {
        categories: ["Pending", "Declined", "Accepted"],
        labels: { style: { colors: ['#ff8c00','#E74C3C','#33d69f'] } }
    },
    yaxis: [
        {
            title: { text: "Total Worth (€)", style: { color: '#9277ff' } },
            labels: { style: { color: '#9277ff' } }
        },
        {
            opposite: true,
            title: { text: "Invoice Count", style: { color: '#FF4560' } },
            labels: { style: { color: '#FF4560' } }
        }
    ],
    colors: ['#9277ff', '#FF4560'],
    plotOptions: { bar: { horizontal: false, columnWidth: '50%' } },

    legend: { labels: { colors: ['#9277ff', '#FF4560'] } },
    theme: { mode: 'dark' }
};

const pieChartSeries = computed(() => [
    invoiceStats.value.Pending.count,
    invoiceStats.value.Declined.count,
    invoiceStats.value.Accepted.count
]);

const pieChartOptions = {
    chart: { type: 'pie', background: 'transparent' },
    labels: ["Pending", "Declined", "Accepted"],
    colors: ['#ff8c00', '#E74C3C', '#33d69f'],
    legend: { labels: { colors: ['#ff8c00', '#E74C3C', '#33d69f'] } },
    theme: { mode: 'dark' }
};

const lineChartSeries = computed(() => [
    { name: "Pending", data: [invoiceStats.value.Pending.total] },
    { name: "Declined", data: [invoiceStats.value.Declined.total] },
    { name: "Accepted", data: [invoiceStats.value.Accepted.total] }
]);

const lineChartOptions = {
    chart: {
        type: 'line',
        height: 350,
        background: 'transparent'
    },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
        categories: ["Total Worth (€)"],
        labels: { style: { color: '#ffffff' } }
    },
    yaxis: {
        title: { text: "Total Worth (€)", style: { color: '#ffffff' } },
        labels: { style: { color: '#ffffff' } }
    },
    colors: ['#ff8c00', '#E74C3C', '#33d69f'],
    legend: { labels: { colors: ['#ff8c00', '#E74C3C', '#33d69f'] } },
    theme: { mode: 'dark' },
    markers: { size: 5 }
};
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
    <h1>Invoice Analytics</h1>

    <div class="charts">
        <h2>Bar chart</h2>
        <apexchart type="bar" :series="barChartSeries" :options="barChartOptions" />
        <h2>Pie chart</h2>
        <apexchart type="pie" :series="pieChartSeries" :options="pieChartOptions" />
        <h2>Line chart</h2>
        <apexchart type="line" :series="lineChartSeries" :options="lineChartOptions" />
    </div>
</div>
</template>

<style scoped>
.container {
    margin-top: 60px;
    text-align: center;
}

h1 {
    margin-bottom: 3rem;
}

h2 {
    margin-top: 3rem;
}

.charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    justify-content: center;
}

@media screen and (max-width: 900px) {
.container {
    margin-top: 130px;
}
}
</style>