export default {
    invoices(state) {
        return state.invoices;
    },
    hasInvoices(state) {
        return state.invoices && state.invoices.length > 0;
    },
    shouldUpdate(state) {
        const lastFetch = state.lastFetch;
        if(!lastFetch) {
            return true;
        }
        const currentTimeStamp = new Date().getTime();
        return (currentTimeStamp - lastFetch) / 1000 > 60;
    }
}